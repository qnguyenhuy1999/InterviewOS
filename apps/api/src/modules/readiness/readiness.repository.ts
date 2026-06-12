import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

export type ReadinessSession = {
  type: 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'MIXED'
  evaluation: {
    overallScore: number | null
    dimensionScores: Prisma.JsonValue
  } | null
}

@Injectable()
export class ReadinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getComputationContext(userId: string) {
    const [rawSessions, reviewItems, learningItems] = await Promise.all([
      this.prisma.interviewSession.findMany({
        where: { userId, status: 'COMPLETED', deletedAt: null },
        include: { evaluation: true },
        orderBy: { endedAt: 'desc' },
        take: 20,
      }),
      this.prisma.reviewItem.findMany({ where: { userId } }),
      this.prisma.learningPathItem.findMany({ where: { userId } }),
    ])

    const sessions = rawSessions as ReadinessSession[]

    return { sessions, reviewItems, learningItems }
  }

  async saveSnapshot(
    userId: string,
    data: {
      overallScore: number
      confidenceLevel: number
      technicalMastery: number
      interviewPerformance: number
      behavioralPerformance: number
      systemDesignPerformance: number
      englishCommunication: number
      reviewCompletion: number
      learningProgress: number
      breakdown: Prisma.InputJsonValue
      improvementTrend: number
    },
  ) {
    return this.prisma.readinessSnapshot.create({ data: { userId, ...data } })
  }

  async findLatest(userId: string) {
    return this.prisma.readinessSnapshot.findFirst({
      where: { userId },
      orderBy: { computedAt: 'desc' },
    })
  }

  async findHistory(userId: string, pagination: { page: number; limit: number }) {
    const skip = (pagination.page - 1) * pagination.limit
    const [items, total] = await Promise.all([
      this.prisma.readinessSnapshot.findMany({
        where: { userId },
        orderBy: { computedAt: 'desc' },
        skip,
        take: pagination.limit,
      }),
      this.prisma.readinessSnapshot.count({
        where: { userId },
      }),
    ])

    return { items, total }
  }

  async findLastSnapshot(userId: string) {
    return this.findLatest(userId)
  }
}
