import type { Prisma } from '@interviewos/database'
import type { ExperienceLevel, InterviewType } from '@interviewos/types'
import { Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { PrismaService } from '../../database/prisma.service'
import { EvaluationRepository } from './evaluation.repository'

@Injectable()
export class EvaluationService {
  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly aiGateway: AIGateway,
    private readonly prisma: PrismaService,
  ) {}

  async getEvaluation(userId: string, sessionId: string) {
    const session = await this.prisma.interviewSession.findFirst({
      where: { id: sessionId, userId, deletedAt: null },
    })
    if (!session) throw new NotFoundException('Session not found.')
    const evaluation = await this.evaluationRepository.findBySession(sessionId)
    if (!evaluation) throw new NotFoundException('Evaluation not ready yet.')
    return evaluation
  }

  async triggerEvaluation(sessionId: string, userId: string): Promise<void> {
    const session = await this.prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { turns: { orderBy: { turnNumber: 'asc' } } },
    })
    if (!session) return

    await this.evaluationRepository.createPending(sessionId)

    try {
      const firstQuestion =
        session.turns.find((t) => t.role === 'INTERVIEWER')?.content ?? 'Interview session'
      const conversation = session.turns.map((t) => ({
        role: t.role as import('@interviewos/types').TurnRole,
        content: t.content,
      }))
      const profile = await this.prisma.userLearningProfile.findUnique({ where: { userId } })

      const result = await this.aiGateway.generateSessionEvaluation(
        {
          sessionType: session.type as InterviewType,
          question: firstQuestion,
          conversation,
          userProfile: {
            level: (session.overrideLevel ?? profile?.targetLevel ?? 'MID') as ExperienceLevel,
            role: session.overrideRole ?? profile?.targetRole ?? 'Software Engineer',
          },
        },
        { userId },
      )

      await this.evaluationRepository.markComplete(sessionId, {
        overallScore: result.result.overallScore,
        dimensionScores: result.result.dimensionScores as unknown as Prisma.InputJsonValue,
        strengths: result.result.strengths,
        improvements: result.result.improvements,
        coachingNotes: result.result.coachingNotes,
        weakConcepts: result.result.weakConcepts,
        aiMetadata: result.metadata as unknown as Prisma.InputJsonValue,
      })
    } catch {
      await this.evaluationRepository.markFailed(sessionId)
    }
  }
}
