import type { DashboardProgress } from '@interviewos/types'

import { serverApiClient } from '@/lib/server-api-client'

export default async function DashboardPage() {
  const progress = await serverApiClient<DashboardProgress>('/analytics/progress').catch(() => null)

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
