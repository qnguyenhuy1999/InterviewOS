import type {
  AIExecutionMetadata,
  ExperienceLevel,
  LearningRecommendation,
  RecommendationPayload,
  RecommendationSummary,
} from '@interviewos/types'
import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { UsersRepository } from '../users/users.repository'
import { RecommendationsRepository } from './recommendations.repository'

type CurrentUserLike = {
  id?: string
}

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly recommendationsRepository: RecommendationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
  ) {}

  async getRecommendations(currentUser: unknown): Promise<RecommendationSummary> {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    const context = await this.recommendationsRepository.getSourceContext(user.id)

    const nextNoteToReview = context.notes[0]
      ? recommendation(
          'Review note',
          `Revisit ${context.notes[0].title} and restate the production checklist out loud.`,
          `/notebook/${context.notes[0].id}`,
        )
      : null

    const nextQuestionSource = context.notes
      .flatMap((note) => note.questions.map((question) => ({ note, question })))
      .at(0)

    const nextQuestionToPractice = nextQuestionSource
      ? recommendation(
          'Practice question',
          nextQuestionSource.question.question,
          `/notebook/${nextQuestionSource.note.id}`,
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

  private resolveUserId(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.id
  }

  private toAiMetadataJson(metadata: AIExecutionMetadata): Prisma.InputJsonValue {
    return metadata as unknown as Prisma.InputJsonValue
  }
}

function recommendation(title: string, reason: string, action: string): RecommendationPayload {
  return { title, reason, action }
}
