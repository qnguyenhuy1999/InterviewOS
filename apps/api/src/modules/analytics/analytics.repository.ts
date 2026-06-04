import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createInterviewAnalyticsSnapshot(userId: string) {
    const sessions = await this.prisma.interviewSession.findMany({
      where: {
        userId,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        evaluation: true,
        turns: true,
      },
      orderBy: {
        endedAt: 'desc',
      },
    })

    const scoredSessions = sessions.filter((session) => session.evaluation?.overallScore != null)
    const averageScore = scoredSessions.length > 0
      ? Math.round(
          scoredSessions.reduce((sum, session) => sum + (session.evaluation?.overallScore ?? 0), 0) /
            scoredSessions.length,
        )
      : null

    const weakCounts = countTerms(scoredSessions.flatMap((session) => session.evaluation?.weakConcepts ?? []))
    const strongCounts = countTerms(
      sessions.flatMap((session) => session.turns.flatMap((turn) => turn.topicTags ?? [])),
      new Set(Object.keys(weakCounts)),
    )

    return this.prisma.interviewAnalytics.create({
      data: {
        userId,
        interviewsCompleted: sessions.length,
        averageScore,
        weakConcepts: topTerms(weakCounts),
        strongConcepts: topTerms(strongCounts),
        trend7d: buildTrend(sessions, 7) as never,
        trend30d: buildTrend(sessions, 30) as never,
        trend90d: buildTrend(sessions, 90) as never,
      },
    })
  }

  findLatestInterviewAnalytics(userId: string) {
    return this.prisma.interviewAnalytics.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}

function countTerms(terms: string[], exclude = new Set<string>()) {
  return terms.reduce<Record<string, number>>((acc, term) => {
    const normalized = term.trim()
    if (!normalized || exclude.has(normalized)) {
      return acc
    }

    acc[normalized] = (acc[normalized] ?? 0) + 1
    return acc
  }, {})
}

function topTerms(counts: Record<string, number>) {
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([term]) => term)
}

function buildTrend(
  sessions: Array<{ endedAt: Date | null; evaluation: { overallScore: number | null } | null }>,
  days: number,
) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const windowSessions = sessions.filter((session) => session.endedAt && session.endedAt >= cutoff)
  const scored = windowSessions.filter((session) => session.evaluation?.overallScore != null)

  return {
    completed: windowSessions.length,
    averageScore: scored.length > 0
      ? Math.round(scored.reduce((sum, session) => sum + (session.evaluation?.overallScore ?? 0), 0) / scored.length)
      : null,
  }
}
