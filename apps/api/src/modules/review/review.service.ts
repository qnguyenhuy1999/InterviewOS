import type { Prisma } from '@interviewos/database'
import type {
  DashboardProgress,
  LearningPathItem,
  ReviewItem as ReviewQueueEntryItem,
  ReviewQueueResponse,
  UserWeakConcept,
} from '@interviewos/types'
import {
  ReviewItemType as SharedReviewItemType,
  ReviewRating as SharedReviewRating,
  WeakConceptStatus as SharedWeakConceptStatus,
} from '@interviewos/types'
import { reviewRatingSchema, weakConceptStatusSchema } from '@interviewos/validators'
import { Injectable, NotFoundException } from '@nestjs/common'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { UsersRepository } from '../users/users.repository'
import type { ReviewRatingDto, WeakConceptStatusDto } from './dto/review.dto'
import { ReviewRepository } from './review.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async syncTechnicalNoteReview(payload: {
    userId: string
    noteId: string
    title: string
    status: string
    aiMetadata?: Prisma.InputJsonValue
  }) {
    return this.reviewRepository.upsertReviewItem({
      userId: payload.userId,
      type: 'TECHNICAL_NOTE',
      sourceId: payload.noteId,
      sourceLabel: payload.title,
      weaknessScore: scoreNoteStatus(payload.status),
      masteryScore: masteryFromNoteStatus(payload.status),
      nextReviewAt: new Date(),
      reviewIntervalDays: 2,
      technicalNoteId: payload.noteId,
      aiMetadata: payload.aiMetadata,
    })
  }

  async replaceQuestionReviews(payload: {
    userId: string
    noteId: string
    questions: Array<{
      id: string
      question: string
      difficulty: string
      expectedConcepts: string[]
    }>
    aiMetadata?: Prisma.InputJsonValue
  }) {
    await this.reviewRepository.deleteQuestionReviewItems(payload.userId, payload.noteId)

    await Promise.all(
      payload.questions.map((question) =>
        this.reviewRepository.upsertReviewItem({
          userId: payload.userId,
          type: 'GENERATED_QUESTION',
          sourceId: question.id,
          sourceLabel: question.question,
          weaknessScore:
            question.difficulty === 'HARD' || question.difficulty === 'EXPERT' ? 72 : 55,
          masteryScore: 0,
          nextReviewAt: new Date(),
          reviewIntervalDays: 1,
          generatedQuestionId: question.id,
          metadata: {
            difficulty: question.difficulty,
            expectedConcepts: question.expectedConcepts,
            noteId: payload.noteId,
          } satisfies Prisma.JsonObject,
          aiMetadata: payload.aiMetadata,
        }),
      ),
    )
  }

  async syncEnglishNoteReviews(
    userId: string,
    notes: Array<{
      id: string
      grammarTopic: string
      originalSentence: string
      status: string
    }>,
    aiMetadata?: Prisma.InputJsonValue,
  ) {
    await Promise.all(
      notes.map((note) =>
        this.reviewRepository.upsertReviewItem({
          userId,
          type: 'ENGLISH_NOTE',
          sourceId: note.id,
          sourceLabel: `${note.grammarTopic}: ${note.originalSentence}`,
          weaknessScore: scoreEnglishStatus(note.status),
          masteryScore: masteryFromEnglishStatus(note.status),
          nextReviewAt: new Date(),
          reviewIntervalDays: 1,
          englishNoteId: note.id,
          metadata: {
            grammarTopic: note.grammarTopic,
          } satisfies Prisma.JsonObject,
          aiMetadata,
        }),
      ),
    )
  }

  async syncWeakConceptReviews(userId: string, weakConcepts: UserWeakConcept[]) {
    await Promise.all(
      weakConcepts.map((concept) =>
        this.reviewRepository.upsertReviewItem({
          userId,
          type: 'WEAK_CONCEPT',
          sourceId: concept.id,
          sourceLabel: concept.concept,
          weaknessScore:
            concept.status === 'IGNORED' ? 0 : Math.min(100, concept.occurrenceCount * 18),
          masteryScore: masteryFromWeakConceptStatus(concept.status),
          nextReviewAt: concept.lastSeenAt,
          reviewIntervalDays: 1,
          weakConceptId: concept.id,
          metadata: {
            concept: concept.concept,
            occurrenceCount: concept.occurrenceCount,
            status: concept.status,
          } satisfies Prisma.JsonObject,
        }),
      ),
    )
  }

  async getReviewQueue(currentUser: CurrentUserRef): Promise<ReviewQueueResponse> {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    const now = new Date()
    const items = await this.reviewRepository.listReviewItems(user.id)

    const ranked = items
      .map((item) => {
        const reasons: string[] = []
        let score = item.weaknessScore + (100 - item.masteryScore)

        if (item.nextReviewAt <= now) {
          score += 150
          reasons.push('overdue')
        }

        if (item.lastFailureAt) {
          score += 60
          reasons.push('recent failure')
        }

        if (profile) {
          const haystack =
            `${item.sourceLabel} ${JSON.stringify(item.metadata ?? {})}`.toLowerCase()
          const roleTerms = [profile.targetRole, ...profile.techStack].map((term) =>
            term.toLowerCase(),
          )
          const roleMatches = roleTerms.filter((term) => haystack.includes(term)).length
          if (roleMatches > 0) {
            score += roleMatches * 15
            reasons.push('role relevant')
          }
        }

        return {
          item,
          priorityScore: score,
          reasons: reasons.length > 0 ? reasons : ['scheduled review'],
        }
      })
      .sort((left, right) => right.priorityScore - left.priorityScore)

    return {
      items: ranked.map((entry) => ({
        ...entry,
        item: mapReviewQueueItem(entry.item),
      })),
      dueCount: ranked.filter((item) => item.item.nextReviewAt <= now).length,
    }
  }

  async rateReviewItem(
    currentUser: CurrentUserRef,
    reviewItemId: string,
    payload: ReviewRatingDto,
  ) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const input = reviewRatingSchema.parse(payload)
    const item = await this.reviewRepository.findReviewItem(user.id, reviewItemId)

    if (!item) {
      throw new NotFoundException('Review item not found.')
    }

    const next = scheduleReview(item.masteryScore, item.reviewIntervalDays, input.rating)

    return this.reviewRepository.createAttemptAndUpdateItem({
      reviewItemId: item.id,
      userId: user.id,
      rating: input.rating,
      masteryBefore: item.masteryScore,
      masteryAfter: next.masteryScore,
      reviewIntervalDays: next.reviewIntervalDays,
      nextReviewAt: next.nextReviewAt,
      weaknessScore: next.weaknessScore,
      lastFailureAt: input.rating === 'AGAIN' ? new Date() : item.lastFailureAt,
    })
  }

  async listWeakConcepts(currentUser: CurrentUserRef) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.reviewRepository.listWeakConcepts(user.id)
  }

  async updateWeakConceptStatus(
    currentUser: CurrentUserRef,
    weakConceptId: string,
    payload: WeakConceptStatusDto,
  ) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const input = weakConceptStatusSchema.parse(payload)
    const concept = await this.reviewRepository.updateWeakConceptStatus(
      user.id,
      weakConceptId,
      input.status,
    )
    await this.syncWeakConceptReviews(user.id, [concept as unknown as UserWeakConcept])
    return concept
  }

  async buildLearningPath(currentUser: CurrentUserRef): Promise<LearningPathItem[]> {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const queue = await this.getReviewQueue(user)
    const items = queue.items.slice(0, 6).map((entry) => ({
      type: entry.item.type,
      title: entry.item.sourceLabel,
      reason: entry.reasons.join(', '),
      actionPath: actionPathForReviewItem(entry.item),
      priorityScore: entry.priorityScore,
      sourceReviewItemId: entry.item.id,
      metadata: {
        reviewType: entry.item.type,
      } satisfies Prisma.JsonObject,
    }))

    return this.reviewRepository.replacePendingLearningPath(user.id, items) as Promise<
      LearningPathItem[]
    >
  }

  async updateLearningPathItem(
    currentUser: CurrentUserRef,
    itemId: string,
    action: 'start' | 'complete' | 'snooze' | 'skip',
  ) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const now = new Date()

    switch (action) {
      case 'start':
        return this.reviewRepository.updateLearningPathItem(user.id, itemId, {
          status: 'IN_PROGRESS',
          startedAt: now,
          snoozedUntil: null,
        })
      case 'complete':
        return this.reviewRepository.updateLearningPathItem(user.id, itemId, {
          status: 'COMPLETED',
          completedAt: now,
        })
      case 'snooze':
        return this.reviewRepository.updateLearningPathItem(user.id, itemId, {
          status: 'SNOOZED',
          snoozedUntil: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        })
      case 'skip':
        return this.reviewRepository.updateLearningPathItem(user.id, itemId, {
          status: 'SKIPPED',
          skippedAt: now,
        })
    }
  }

  async getDashboardProgress(currentUser: CurrentUserRef): Promise<DashboardProgress> {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const [reviewItems, answers, notesMastered, weakConcepts, attempts, englishNotes] =
      await this.reviewRepository.dashboardContext(user.id, new Date())

    const dueReviews = reviewItems.filter((item) => item.nextReviewAt <= new Date()).length
    const interviewReadiness = answers.length
      ? clamp(
          Math.round(
            answers.reduce((sum, answer) => sum + (answer.overallScore ?? 0), 0) / answers.length,
          ),
        )
      : 0
    const technicalMastery = reviewItems.length
      ? clamp(
          Math.round(
            reviewItems.reduce((sum, item) => sum + item.masteryScore, 0) / reviewItems.length,
          ),
        )
      : 0
    const englishScore = englishNotes.length
      ? clamp(
          Math.round(
            (englishNotes.filter((note) => note.status === 'IMPROVED' || note.status === 'MASTERED')
              .length /
              englishNotes.length) *
              100,
          ),
        )
      : 0

    return {
      interviewReadiness,
      technicalMastery,
      englishScore,
      reviewStreak: computeReviewStreak(attempts.map((attempt) => attempt.createdAt)),
      questionsPracticed: answers.length,
      notesMastered,
      dueReviews,
      weakConceptTrends: weakConcepts.slice(0, 6).map((concept) => ({
        concept: concept.concept,
        occurrenceCount: concept.occurrenceCount,
        status: mapWeakConceptStatus(concept.status),
      })),
    }
  }
}

function mapReviewQueueItem(item: {
  id: string
  userId: string
  type: string
  sourceId: string
  sourceLabel: string
  weaknessScore: number
  masteryScore: number
  nextReviewAt: Date
  reviewIntervalDays: number
  lastReviewedAt: Date | null
  lastFailureAt: Date | null
  lastRating: string | null
  metadata: unknown
  createdAt: Date
  updatedAt: Date
}): ReviewQueueEntryItem {
  return {
    ...item,
    type: mapReviewItemType(item.type),
    lastRating: mapReviewRating(item.lastRating),
  }
}

function mapReviewItemType(type: string): SharedReviewItemType {
  switch (type) {
    case 'TECHNICAL_NOTE':
      return SharedReviewItemType.TECHNICAL_NOTE
    case 'GENERATED_QUESTION':
      return SharedReviewItemType.GENERATED_QUESTION
    case 'ENGLISH_NOTE':
      return SharedReviewItemType.ENGLISH_NOTE
    case 'WEAK_CONCEPT':
      return SharedReviewItemType.WEAK_CONCEPT
    default:
      throw new Error(`Unsupported review item type: ${type}`)
  }
}

function mapReviewRating(rating: string | null): SharedReviewRating | null {
  switch (rating) {
    case 'AGAIN':
      return SharedReviewRating.AGAIN
    case 'HARD':
      return SharedReviewRating.HARD
    case 'GOOD':
      return SharedReviewRating.GOOD
    case 'EASY':
      return SharedReviewRating.EASY
    case null:
      return null
    default:
      throw new Error(`Unsupported review rating: ${rating}`)
  }
}

function mapWeakConceptStatus(status: string): SharedWeakConceptStatus {
  switch (status) {
    case 'ACTIVE':
      return SharedWeakConceptStatus.ACTIVE
    case 'IMPROVING':
      return SharedWeakConceptStatus.IMPROVING
    case 'RESOLVED':
      return SharedWeakConceptStatus.RESOLVED
    case 'IGNORED':
      return SharedWeakConceptStatus.IGNORED
    default:
      throw new Error(`Unsupported weak concept status: ${status}`)
  }
}

function scheduleReview(
  masteryScore: number,
  intervalDays: number,
  rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY',
) {
  const now = new Date()

  switch (rating) {
    case 'AGAIN':
      return {
        masteryScore: clamp(masteryScore - 15),
        reviewIntervalDays: 1,
        nextReviewAt: addDays(now, 1),
        weaknessScore: 100,
      }
    case 'HARD':
      return {
        masteryScore: clamp(masteryScore + 5),
        reviewIntervalDays: Math.max(1, Math.round(intervalDays * 1.5)),
        nextReviewAt: addDays(now, Math.max(1, Math.round(intervalDays * 1.5))),
        weaknessScore: Math.max(20, 90 - masteryScore),
      }
    case 'GOOD':
      return {
        masteryScore: clamp(masteryScore + 12),
        reviewIntervalDays: Math.max(2, Math.round(intervalDays * 2)),
        nextReviewAt: addDays(now, Math.max(2, Math.round(intervalDays * 2))),
        weaknessScore: Math.max(10, 75 - masteryScore),
      }
    case 'EASY':
      return {
        masteryScore: clamp(masteryScore + 20),
        reviewIntervalDays: Math.max(4, Math.round(intervalDays * 3)),
        nextReviewAt: addDays(now, Math.max(4, Math.round(intervalDays * 3))),
        weaknessScore: Math.max(0, 55 - masteryScore),
      }
  }
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

function masteryFromNoteStatus(status: string) {
  switch (status) {
    case 'MASTERED':
      return 90
    case 'INTERVIEW_READY':
      return 75
    case 'REVIEWING':
      return 45
    case 'NEEDS_PRACTICE':
      return 25
    default:
      return 10
  }
}

function scoreNoteStatus(status: string) {
  return 100 - masteryFromNoteStatus(status)
}

function masteryFromEnglishStatus(status: string) {
  switch (status) {
    case 'MASTERED':
      return 90
    case 'IMPROVED':
      return 70
    case 'REVIEWING':
      return 45
    default:
      return 20
  }
}

function scoreEnglishStatus(status: string) {
  return 100 - masteryFromEnglishStatus(status)
}

function masteryFromWeakConceptStatus(status: string) {
  switch (status) {
    case 'RESOLVED':
      return 85
    case 'IMPROVING':
      return 55
    case 'IGNORED':
      return 0
    default:
      return 20
  }
}

function actionPathForReviewItem(item: { type: string; sourceId: string; metadata?: unknown }) {
  switch (item.type) {
    case 'TECHNICAL_NOTE':
      return `/notebook/${item.sourceId}`
    case 'GENERATED_QUESTION': {
      const metadata = (item.metadata ?? {}) as Record<string, unknown>
      const noteId = typeof metadata.noteId === 'string' ? metadata.noteId : null
      return noteId ? `/notebook/${noteId}` : '/interview'
    }
    case 'ENGLISH_NOTE':
      return '/english-notes'
    case 'WEAK_CONCEPT':
      return '/review'
    default:
      return '/learning-path'
  }
}

function computeReviewStreak(dates: Date[]) {
  if (dates.length === 0) {
    return 0
  }

  const uniqueDays = Array.from(new Set(dates.map((date) => date.toISOString().slice(0, 10))))
    .sort()
    .reverse()
  let streak = 0
  let cursor = new Date()

  for (const day of uniqueDays) {
    const expected = cursor.toISOString().slice(0, 10)
    if (day !== expected) {
      break
    }

    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}
