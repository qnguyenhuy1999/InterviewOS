import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ReadinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getComputationContext(userId: string) {
    const [sessions, reviewItems, learningItems] = await Promise.all([
      this.prisma.interviewSession.findMany({
        where: { userId, status: 'PUBLISHED', deletedAt: null },
        include: { evaluation: true },
        orderBy: { endedAt: 'desc' },
        take: 20,
      }),
      this.prisma.reviewItem.findMany({ where: { userId } }),
      this.prisma.learningPathItem.findMany({ where: { userId } }),
    ])

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

  async findHistory(userId: string, limit = 10) {
    return this.prisma.readinessSnapshot.findMany({
      where: { userId },
      orderBy: { computedAt: 'desc' },
      take: limit,
    })
  }

  async findLastSnapshot(userId: string) {
    return this.findLatest(userId)
  }
}
