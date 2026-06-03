import type { LearningPathItem } from '@interviewos/types'

import { LearningPathActions } from '@/components/forms/LearningPathActions'
import { serverApiClient } from '@/lib/server-api-client'

export default async function LearningPathPage() {
  const items = await serverApiClient<LearningPathItem[]>('/learning-path').catch(() => [])

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Your learning path will appear after notes, questions, or weak concepts create review work.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.type} | {item.status} | {item.actionPath}
              </p>
            </div>
            <LearningPathActions itemId={item.id} />
          </div>
        </div>
      ))}
    </div>
  )
}
