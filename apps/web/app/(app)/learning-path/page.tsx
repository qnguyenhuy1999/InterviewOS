import type { RecommendationSummary } from '@interviewos/types'

import { EmptyState } from '@/components/empty-states/EmptyState'
import { apiClient } from '@/lib/api-client'

export default async function LearningPathPage() {
  const summary = await apiClient<RecommendationSummary>('/recommendations').catch(() => null)

  if (!summary) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load recommendations.
      </div>
    )
  }

  if (
    !summary.nextNoteToReview &&
    !summary.nextQuestionToPractice &&
    !summary.nextEnglishTopic &&
    !summary.nextLearningItem
  ) {
    return (
      <EmptyState
        title="Your learning path is ready"
        description="Complete onboarding, create a note, and finish one practice session to unlock recommendations."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RecommendationCard title="Next note to review" item={summary.nextNoteToReview} />
      <RecommendationCard title="Next question to practice" item={summary.nextQuestionToPractice} />
      <RecommendationCard title="Next English topic" item={summary.nextEnglishTopic} />
      <RecommendationCard title="Next learning item" item={summary.nextLearningItem} />
    </div>
  )
}

function RecommendationCard({
  title,
  item,
}: {
  title: string
  item: RecommendationSummary['nextNoteToReview']
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-medium">{title}</h3>
      {item ? (
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{item.title}</p>
          <p>{item.reason}</p>
          <p>{item.action}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No recommendation available yet.</p>
      )}
    </section>
  )
}
