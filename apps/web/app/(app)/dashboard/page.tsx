import type { DashboardProgress } from '@interviewos/types'

import { serverApiClient } from '@/lib/server-api-client'

type ReadinessBreakdownItem = {
  dimension: string
  label: string
  score: number
  weight: number
  trend: 'UP' | 'DOWN' | 'STABLE'
}

type ReadinessSnapshot = {
  overallScore: number
  confidenceLevel: number
  improvementTrend: number
  breakdown: ReadinessBreakdownItem[]
}

const TREND_ICON: Record<string, string> = { UP: '↑', DOWN: '↓', STABLE: '→' }
const TREND_COLOR: Record<string, string> = {
  UP: 'text-green-500',
  DOWN: 'text-red-500',
  STABLE: 'text-muted-foreground',
}

export default async function DashboardPage() {
  const [progress, readiness] = await Promise.all([
    serverApiClient<DashboardProgress>('/analytics/progress').catch(() => null),
    serverApiClient<ReadinessSnapshot>('/readiness/latest').catch(() => null),
  ])

  if (!progress) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Dashboard metrics will appear once you have reviewable activity.
      </div>
    )
  }

  const cards = [
    ['Interview readiness', progress.interviewReadiness],
    ['Technical mastery', progress.technicalMastery],
    ['English score', progress.englishScore],
    ['Review streak', progress.reviewStreak],
    ['Questions practiced', progress.questionsPracticed],
    ['Notes mastered', progress.notesMastered],
    ['Due reviews', progress.dueReviews],
  ]

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-heading text-2xl font-medium">{value}</p>
          </div>
        ))}
      </section>

      {readiness && (
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="font-heading text-lg font-medium">Interview readiness</h2>
            <div className="text-right">
              <p className="font-heading text-3xl font-medium">{readiness.overallScore}</p>
              <p
                className={`text-xs ${
                  TREND_COLOR[readiness.improvementTrend > 0 ? 'UP' : readiness.improvementTrend < 0 ? 'DOWN' : 'STABLE']
                }`}
              >
                {TREND_ICON[readiness.improvementTrend > 0 ? 'UP' : readiness.improvementTrend < 0 ? 'DOWN' : 'STABLE']}{' '}
                {readiness.improvementTrend > 0 ? '+' : ''}
                {readiness.improvementTrend} pts
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {(readiness.breakdown as ReadinessBreakdownItem[]).map((item) => (
              <div key={item.dimension} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`flex items-center gap-1 font-medium ${TREND_COLOR[item.trend]}`}>
                    <span className="text-xs">{TREND_ICON[item.trend]}</span>
                    {item.score}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(item.score, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Confidence: {Math.round(readiness.confidenceLevel * 100)}%
          </p>
        </section>
      )}

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-medium">Weak concept trends</h2>
        <div className="mt-4 space-y-3">
          {progress.weakConceptTrends.map((concept) => (
            <div
              key={concept.concept}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3"
            >
              <div>
                <p className="text-sm font-medium">{concept.concept}</p>
                <p className="text-sm text-muted-foreground">{concept.status}</p>
              </div>
              <p className="text-sm text-muted-foreground">{concept.occurrenceCount} hits</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
