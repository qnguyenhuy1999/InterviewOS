import type { RecommendationSummary } from '@interviewos/types'

import { serverApiClient } from '@/lib/server-api-client'

export default async function LearningPathPage() {
  const summary = await serverApiClient<RecommendationSummary>('/recommendations').catch(
    () => null,
  )

  if (!summary) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Generate recommendations after completing onboarding and at least one interview session.
      </div>
    )
  }

  const items = [
    summary.nextNoteToReview,
    summary.nextQuestionToPractice,
    summary.nextEnglishTopic,
    summary.nextLearningItem,
  ].filter(Boolean)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item?.title}-${item?.action}`} className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium">{item?.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{item?.reason}</p>
          <p className="mt-2 text-sm text-muted-foreground">{item?.action}</p>
        </div>
      ))}
    </div>
  )
}
