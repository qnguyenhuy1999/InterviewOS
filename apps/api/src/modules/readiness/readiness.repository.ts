import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ReadinessRepository {
  constructor(private readonly prisma: PrismaService) {}

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
