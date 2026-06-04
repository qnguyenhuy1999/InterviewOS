import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class EvaluationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPending(sessionId: string) {
    return this.prisma.interviewEvaluation.upsert({
      where: { sessionId },
      create: {
        sessionId,
        status: 'PENDING',
        dimensionScores: {},
        rubricScores: [],
        evidence: [],
        weaknesses: [],
        recommendations: [],
        strengths: [],
        improvements: [],
        coachingNotes: [],
        weakConcepts: [],
      },
      update: { status: 'PENDING' },
    })
  }

  async markComplete(
    sessionId: string,
    data: {
      overallScore: number
      summary?: string | null
      confidence?: number | null
      dimensionScores: Prisma.InputJsonValue
      starScores?: Prisma.InputJsonValue
      designScores?: Prisma.InputJsonValue
      rubricScores?: Prisma.InputJsonValue
      evidence?: Prisma.InputJsonValue
      weaknesses?: Prisma.InputJsonValue
      recommendations?: Prisma.InputJsonValue
      strengths: string[]
      improvements: string[]
      coachingNotes: string[]
      weakConcepts: string[]
      aiMetadata: Prisma.InputJsonValue
    },
  ) {
    return this.prisma.interviewEvaluation.update({
      where: { sessionId },
      data: {
        status: 'COMPLETE',
        overallScore: data.overallScore,
        summary: data.summary ?? null,
        confidence: data.confidence ?? null,
        dimensionScores: data.dimensionScores,
        starScores: data.starScores as never,
        designScores: data.designScores as never,
        rubricScores: data.rubricScores as never,
        evidence: data.evidence as never,
        weaknesses: data.weaknesses as never,
        recommendations: data.recommendations as never,
        strengths: data.strengths,
        improvements: data.improvements,
        coachingNotes: data.coachingNotes,
        weakConcepts: data.weakConcepts,
        aiMetadata: data.aiMetadata,
        updatedAt: new Date(),
      },
    })
  }

  async markFailed(sessionId: string) {
    return this.prisma.interviewEvaluation.update({
      where: { sessionId },
      data: { status: 'FAILED', updatedAt: new Date() },
    })
  }

  async findBySession(sessionId: string) {
    return this.prisma.interviewEvaluation.findUnique({ where: { sessionId } })
  }
}
