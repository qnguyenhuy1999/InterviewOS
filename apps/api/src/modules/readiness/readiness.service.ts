import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { ReadinessRepository } from './readiness.repository'

const WEIGHTS = {
  technicalMastery: 0.25,
  interviewPerformance: 0.2,
  behavioralPerformance: 0.15,
  systemDesignPerformance: 0.15,
  englishCommunication: 0.1,
  reviewCompletion: 0.1,
  learningProgress: 0.05,
} as const

const LABELS: Record<keyof typeof WEIGHTS, string> = {
  technicalMastery: 'Technical Mastery',
  interviewPerformance: 'Interview Performance',
  behavioralPerformance: 'Behavioral Performance',
  systemDesignPerformance: 'System Design',
  englishCommunication: 'English Communication',
  reviewCompletion: 'Review Completion',
  learningProgress: 'Learning Progress',
}

@Injectable()
export class ReadinessService {
  constructor(private readonly readinessRepository: ReadinessRepository) {}

  findLatest(userId: string) {
    return this.readinessRepository.findLatest(userId)
  }

  findHistory(userId: string, limit?: number) {
    return this.readinessRepository.findHistory(userId, limit)
  }

  async computeAndSave(userId: string) {
    const { sessions, reviewItems, learningItems } =
      await this.readinessRepository.getComputationContext(userId)

    const technicalSessions = sessions.filter(
      (s) => s.type === 'TECHNICAL' && s.evaluation?.overallScore != null,
    )
    const behavioralSessions = sessions.filter(
      (s) => s.type === 'BEHAVIORAL' && s.evaluation?.overallScore != null,
    )
    const designSessions = sessions.filter(
      (s) => s.type === 'SYSTEM_DESIGN' && s.evaluation?.overallScore != null,
    )

    const avg = (nums: number[]) =>
      nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length / 100 : 0

    const dims = {
      technicalMastery: avg(
        reviewItems.filter((r) => r.masteryScore > 0).map((r) => r.masteryScore * 100),
      ),
      interviewPerformance: avg(technicalSessions.map((s) => s.evaluation!.overallScore!)),
      behavioralPerformance: avg(behavioralSessions.map((s) => s.evaluation!.overallScore!)),
      systemDesignPerformance: avg(designSessions.map((s) => s.evaluation!.overallScore!)),
      englishCommunication: avg(
        sessions.flatMap((s) => {
          const ds = s.evaluation?.dimensionScores as {
            clarity?: number
            confidence?: number
          } | null
          return ds ? [(((ds.clarity ?? 0) + (ds.confidence ?? 0)) / 2) * 10] : []
        }),
      ),
      reviewCompletion:
        reviewItems.length > 0
          ? reviewItems.filter((r) => r.masteryScore >= 0.7).length / reviewItems.length
          : 0,
      learningProgress:
        learningItems.length > 0
          ? learningItems.filter((r) => r.status === 'COMPLETED').length / learningItems.length
          : 0,
    }

    const overallScore = Math.round(
      Object.entries(WEIGHTS).reduce(
        (sum, [key, weight]) => sum + (dims[key as keyof typeof dims] ?? 0) * weight * 100,
        0,
      ),
    )

    const sessionCount = sessions.length
    const confidenceLevel = Math.min(sessionCount / 10, 1)

    const prev = await this.readinessRepository.findLastSnapshot(userId)
    const improvementTrend = prev ? overallScore - prev.overallScore : 0

    const breakdown: Prisma.InputJsonValue = Object.entries(WEIGHTS).map(([key, weight]) => ({
      dimension: key,
      score: Math.round((dims[key as keyof typeof dims] ?? 0) * 100),
      weight,
      label: LABELS[key as keyof typeof WEIGHTS],
      trend: improvementTrend > 0 ? 'UP' : improvementTrend < 0 ? 'DOWN' : 'STABLE',
    })) as unknown as Prisma.InputJsonValue

    return this.readinessRepository.saveSnapshot(userId, {
      overallScore,
      confidenceLevel,
      ...dims,
      breakdown,
      improvementTrend,
    })
  }
}
