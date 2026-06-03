import type {
  LearningPathItemStatus,
  Prisma,
  ReviewItemType,
  ReviewRating,
  WeakConceptStatus,
} from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertReviewItem(payload: {
    userId: string
    type: ReviewItemType
    sourceId: string
    sourceLabel: string
    weaknessScore?: number
    masteryScore?: number
    nextReviewAt?: Date
    reviewIntervalDays?: number
    metadata?: Prisma.InputJsonValue
    aiMetadata?: Prisma.InputJsonValue
    technicalNoteId?: string
    generatedQuestionId?: string
    englishNoteId?: string
    weakConceptId?: string
  }) {
    return this.prisma.reviewItem.upsert({
      where: {
        userId_type_sourceId: {
          userId: payload.userId,
          type: payload.type,
          sourceId: payload.sourceId,
        },
      },
      create: {
        userId: payload.userId,
        type: payload.type,
        sourceId: payload.sourceId,
        sourceLabel: payload.sourceLabel,
        weaknessScore: payload.weaknessScore ?? 0,
        masteryScore: payload.masteryScore ?? 0,
        nextReviewAt: payload.nextReviewAt ?? new Date(),
        reviewIntervalDays: payload.reviewIntervalDays ?? 1,
        metadata: payload.metadata,
        aiMetadata: payload.aiMetadata,
        technicalNoteId: payload.technicalNoteId,
        generatedQuestionId: payload.generatedQuestionId,
        englishNoteId: payload.englishNoteId,
        weakConceptId: payload.weakConceptId,
      },
      update: {
        sourceLabel: payload.sourceLabel,
        weaknessScore: payload.weaknessScore,
        masteryScore: payload.masteryScore,
        nextReviewAt: payload.nextReviewAt,
        reviewIntervalDays: payload.reviewIntervalDays,
        metadata: payload.metadata,
        aiMetadata: payload.aiMetadata,
        technicalNoteId: payload.technicalNoteId,
        generatedQuestionId: payload.generatedQuestionId,
        englishNoteId: payload.englishNoteId,
        weakConceptId: payload.weakConceptId,
      },
    })
  }

  deleteQuestionReviewItems(userId: string, noteId: string) {
    return this.prisma.reviewItem.deleteMany({
      where: {
        userId,
        type: 'GENERATED_QUESTION',
        generatedQuestion: {
          noteId,
        },
      },
    })
  }

  listReviewItems(userId: string) {
    return this.prisma.reviewItem.findMany({
      where: { userId },
      orderBy: [{ nextReviewAt: 'asc' }, { weaknessScore: 'desc' }],
    })
  }

  findReviewItem(userId: string, reviewItemId: string) {
    return this.prisma.reviewItem.findFirst({
      where: {
        id: reviewItemId,
        userId,
      },
    })
  }

  createAttemptAndUpdateItem(payload: {
    reviewItemId: string
    userId: string
    rating: ReviewRating
    masteryBefore: number
    masteryAfter: number
    reviewIntervalDays: number
    nextReviewAt: Date
    weaknessScore: number
    lastFailureAt?: Date | null
  }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.reviewAttempt.create({
        data: {
          reviewItemId: payload.reviewItemId,
          userId: payload.userId,
          rating: payload.rating,
          masteryBefore: payload.masteryBefore,
          masteryAfter: payload.masteryAfter,
          reviewIntervalDays: payload.reviewIntervalDays,
          nextReviewAt: payload.nextReviewAt,
        },
      })

      return tx.reviewItem.update({
        where: { id: payload.reviewItemId },
        data: {
          masteryScore: payload.masteryAfter,
          reviewIntervalDays: payload.reviewIntervalDays,
          nextReviewAt: payload.nextReviewAt,
          weaknessScore: payload.weaknessScore,
          lastRating: payload.rating,
          lastReviewedAt: new Date(),
          lastFailureAt: payload.lastFailureAt,
        },
      })
    })
  }

  listWeakConcepts(userId: string) {
    return this.prisma.userWeakConcept.findMany({
      where: { userId },
      orderBy: [{ occurrenceCount: 'desc' }, { updatedAt: 'desc' }],
    })
  }

  updateWeakConceptStatus(userId: string, weakConceptId: string, status: WeakConceptStatus) {
    return this.prisma.userWeakConcept.update({
      where: {
        id: weakConceptId,
        userId,
      },
      data: { status },
    })
  }

  listLearningPathItems(userId: string, now: Date) {
    return this.prisma.learningPathItem.findMany({
      where: {
        userId,
        OR: [{ snoozedUntil: null }, { snoozedUntil: { lte: now } }],
      },
      orderBy: [{ priorityScore: 'desc' }, { createdAt: 'asc' }],
    })
  }

  async replacePendingLearningPath(
    userId: string,
    items: Array<{
      type: string
      title: string
      reason: string
      actionPath: string
      priorityScore: number
      sourceReviewItemId?: string
      metadata?: Prisma.InputJsonValue
    }>,
  ) {
    await this.prisma.learningPathItem.deleteMany({
      where: {
        userId,
        status: {
          in: ['PENDING', 'IN_PROGRESS', 'SNOOZED'],
        },
      },
    })

    if (items.length === 0) {
      return []
    }

    await this.prisma.learningPathItem.createMany({
      data: items.map((item) => ({
        userId,
        type: item.type,
        title: item.title,
        reason: item.reason,
        actionPath: item.actionPath,
        priorityScore: item.priorityScore,
        sourceReviewItemId: item.sourceReviewItemId,
        metadata: item.metadata,
      })),
    })

    return this.listLearningPathItems(userId, new Date())
  }

  updateLearningPathItem(
    userId: string,
    itemId: string,
    data: {
      status: LearningPathItemStatus
      snoozedUntil?: Date | null
      startedAt?: Date | null
      completedAt?: Date | null
      skippedAt?: Date | null
    },
  ) {
    return this.prisma.learningPathItem.update({
      where: {
        id: itemId,
        userId,
      },
      data,
    })
  }

  dashboardContext(userId: string, now: Date) {
    return Promise.all([
      this.prisma.reviewItem.findMany({
        where: { userId },
        orderBy: [{ nextReviewAt: 'asc' }],
      }),
      this.prisma.interviewAnswer.findMany({
        where: {
          question: {
            session: {
              userId,
            },
          },
        },
        include: {
          question: {
            include: {
              session: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.technicalNote.count({
        where: {
          userId,
          status: 'MASTERED',
          deletedAt: null,
        },
      }),
      this.prisma.userWeakConcept.findMany({
        where: { userId },
        orderBy: [{ occurrenceCount: 'desc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.reviewAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.englishNote.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.learningPathItem.findMany({
        where: {
          userId,
          status: {
            not: 'COMPLETED',
          },
          OR: [{ snoozedUntil: null }, { snoozedUntil: { lte: now } }],
        },
      }),
    ])
  }

  findEnglishNote(userId: string, englishNoteId: string) {
    return this.prisma.englishNote.findFirst({
      where: {
        id: englishNoteId,
        userId,
      },
    })
  }
}
