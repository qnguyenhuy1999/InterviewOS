import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class EvaluationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPending(sessionId: string) {
    return this.prisma.interviewEvaluation.upsert({
      where: { sessionId },
      create: { sessionId, status: 'PENDING', dimensionScores: {}, strengths: [], improvements: [], coachingNotes: [], weakConcepts: [] },
      update: { status: 'PENDING' },
    })
  }

  async markComplete(
    sessionId: string,
    data: {
      overallScore: number
      dimensionScores: Prisma.InputJsonValue
      starScores?: Prisma.InputJsonValue
      designScores?: Prisma.InputJsonValue
      strengths: string[]
      improvements: string[]
      coachingNotes: string[]
      weakConcepts: string[]
      aiMetadata: Prisma.InputJsonValue
    },
  ) {
    return this.prisma.interviewEvaluation.update({
      where: { sessionId },
      data: { status: 'COMPLETE', ...data, updatedAt: new Date() },
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
