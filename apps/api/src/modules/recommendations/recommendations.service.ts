import type { Prisma } from '@interviewos/database'
import type {
  AIExecutionMetadata,
  ExperienceLevel,
  LearningRecommendation,
  RecommendationPayload,
  RecommendationSummary,
} from '@interviewos/types'
import { Injectable } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import { RecommendationsRepository } from './recommendations.repository'

type CurrentUserRef = { id: string }

@Injectable()
export class RecommendationsService {
  private readonly reviewActions: Pick<ReviewService, 'getReviewQueue'>

  constructor(
    private readonly recommendationsRepository: RecommendationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
    reviewService?: ReviewService,
  ) {
    this.reviewActions = reviewService ?? {
      getReviewQueue: async () => ({ items: [], dueCount: 0 }),
    }
  }

  async getRecommendations(currentUser: CurrentUserRef): Promise<RecommendationSummary> {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    const context = await this.recommendationsRepository.getSourceContext(user.id)
    const queue = await this.reviewActions.getReviewQueue(user)

    const nextReview = queue.items[0]?.item
    const nextNoteToReview = nextReview?.type === 'TECHNICAL_NOTE'
      ? recommendation(
          'Review note',
          `Overdue note review for ${nextReview.sourceLabel}.`,
          `/notebook/${nextReview.sourceId}`,
        )
      : null

    const nextQuestionReview = queue.items.find((item) => item.item.type === 'GENERATED_QUESTION')?.item

    const nextQuestionToPractice = nextQuestionReview
      ? recommendation(
          'Practice question',
          nextQuestionReview.sourceLabel,
          routeFromMetadata(nextQuestionReview.metadata, '/interview'),
        )
      : null

    const nextEnglishTopic = context.englishWeaknesses[0]
      ? recommendation(
          'English topic',
          `Repeat mistakes in ${context.englishWeaknesses[0].topic} need another spoken pass.`,
          '/english-notes',
        )
      : null

    const aiNext = profile
      ? await this.aiGateway.recommendNextLearning({
          userId: user.id,
          currentLevel: profile.currentLevel as unknown as ExperienceLevel,
          techStack: profile.techStack,
          recentTopics: context.notes.slice(0, 3).map((note) => note.title),
          weakConcepts: context.weakConcepts.slice(0, 5).map((item) => item.concept),
        }, { userId: user.id })
      : null

    const nextLearningItem = aiNext?.result.recommendations[0]
      ? recommendation(
          aiNext.result.recommendations[0].topic,
          aiNext.result.recommendations[0].reason,
          aiNext.result.recommendations[0].action,
        )
      : null

    const persisted = await this.recommendationsRepository.replaceRecommendations(
      user.id,
      [
        nextNoteToReview && { type: 'note-review', payload: nextNoteToReview },
        nextQuestionToPractice && { type: 'question-practice', payload: nextQuestionToPractice },
        nextEnglishTopic && { type: 'english-topic', payload: nextEnglishTopic },
        nextLearningItem && { type: 'next-learning', payload: nextLearningItem },
      ].filter((item): item is { type: string; payload: RecommendationPayload } => Boolean(item)),
      aiNext ? this.toAiMetadataJson(aiNext.metadata) : undefined,
    )

    return {
      nextNoteToReview,
      nextQuestionToPractice,
      nextEnglishTopic,
      nextLearningItem,
      persisted: persisted.map((item) => ({
        ...item,
        payload: item.payload as unknown as RecommendationPayload,
      })) as LearningRecommendation[],
    }
  }

  private toAiMetadataJson(metadata: AIExecutionMetadata): Prisma.InputJsonValue {
    return metadata as unknown as Prisma.InputJsonValue
  }
}

function recommendation(title: string, reason: string, action: string): RecommendationPayload {
  return { title, reason, action }
}

function routeFromMetadata(metadata: unknown, fallback: string) {
  const noteId = (metadata as { noteId?: unknown } | null)?.noteId
  return typeof noteId === 'string' ? `/notebook/${noteId}` : fallback
}
