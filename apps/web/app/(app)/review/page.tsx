import { type ReviewQueueResponse, type UserWeakConcept,WeakConceptStatus } from '@interviewos/types'

import { ReviewRatingActions } from '@/components/forms/ReviewRatingActions'
import { StatusSelect } from '@/components/forms/StatusSelect'
import { serverApiClient } from '@/lib/server-api-client'

export default async function ReviewPage() {
  const [queue, weakConcepts] = await Promise.all([
    serverApiClient<ReviewQueueResponse>('/review').catch(() => ({ items: [], dueCount: 0 })),
    serverApiClient<UserWeakConcept[]>('/weak-concepts').catch(() => []),
  ])

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-xl font-medium">Review Queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {queue.dueCount} due reviews prioritized by urgency, weakness, and recent failures.
        </p>
      </section>

      {queue.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No reviews are queued right now.
        </div>
      ) : (
        <div className="space-y-4">
          {queue.items.map((entry) => (
            <div key={entry.item.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{entry.item.sourceLabel}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {entry.item.type.replaceAll('_', ' ')} | Score {Math.round(entry.priorityScore)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reasons: {entry.reasons.join(', ')} | Next review{' '}
                    {new Date(entry.item.nextReviewAt).toLocaleString()}
                  </p>
                </div>
                <ReviewRatingActions reviewItemId={entry.item.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-lg font-medium">Weak Concepts</h3>
          <p className="text-sm text-muted-foreground">Status changes feed recommendation scoring.</p>
        </div>
        <div className="space-y-3">
          {weakConcepts.map((concept) => (
            <div
              key={concept.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <p className="text-sm font-medium">{concept.concept}</p>
                <p className="text-sm text-muted-foreground">
                  Seen {concept.occurrenceCount} times | Last seen{' '}
                  {new Date(concept.lastSeenAt).toLocaleString()}
                </p>
              </div>
              <StatusSelect
                endpoint={`/weak-concepts/${concept.id}/status`}
                value={concept.status}
                options={Object.values(WeakConceptStatus)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
