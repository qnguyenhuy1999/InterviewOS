import { type LearningPathItem, LearningPathItemStatus } from '@interviewos/types'
import Link from 'next/link'

import { LearningPathActions } from '@/components/forms/LearningPathActions'
import { serverApiClient } from '@/lib/server-api-client'

const STATUS_GROUPS: Array<{
  key: string
  label: string
  statuses: LearningPathItemStatus[]
}> = [
  {
    key: 'active',
    label: 'Active work',
    statuses: [LearningPathItemStatus.PENDING, LearningPathItemStatus.IN_PROGRESS],
  },
  {
    key: 'completed',
    label: 'Completed',
    statuses: [LearningPathItemStatus.COMPLETED],
  },
  {
    key: 'paused',
    label: 'Paused or skipped',
    statuses: [LearningPathItemStatus.SNOOZED, LearningPathItemStatus.SKIPPED],
  },
]

export default async function LearningPathPage() {
  const items = await serverApiClient<LearningPathItem[]>('/learning-path').catch(() => [])

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Your learning path will appear after notes, questions, or weak concepts create review work.
      </div>
    )
  }

  const completedCount = items.filter(
    (item) => item.status === LearningPathItemStatus.COMPLETED,
  ).length
  const progressPercent = Math.round((completedCount / items.length) * 100)
  const groupedByStatus = STATUS_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => group.statuses.includes(item.status as LearningPathItemStatus)),
  })).filter((group) => group.items.length > 0)
  const groupedByType = Array.from(
    items.reduce((map, item) => {
      const current = map.get(item.type) ?? []
      current.push(item)
      map.set(item.type, current)
      return map
    }, new Map<string, LearningPathItem[]>()),
  )
    .map(([type, typeItems]) => ({
      type,
      total: typeItems.length,
      completed: typeItems.filter((item) => item.status === LearningPathItemStatus.COMPLETED)
        .length,
    }))
    .sort((left, right) => right.total - left.total || left.type.localeCompare(right.type))

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-medium">Learning Path</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review work is grouped by status and type so progress is visible without changing the
              backend contract.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall progress</p>
            <p className="font-heading text-2xl font-medium">
              {completedCount}/{items.length}
            </p>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{progressPercent}% complete</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {groupedByType.map((group) => {
          const percent = Math.round((group.completed / group.total) * 100)
          return (
            <div key={group.type} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">{formatLabel(group.type)}</p>
              <p className="mt-2 font-heading text-2xl font-medium">
                {group.completed}/{group.total}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{percent}% completed</p>
            </div>
          )
        })}
      </section>

      <div className="space-y-4">
        {groupedByStatus.map((group) => (
          <section key={group.key} className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
              <div>
                <h3 className="font-heading text-base font-medium">{group.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {
                    group.items.filter((item) => item.status === LearningPathItemStatus.COMPLETED)
                      .length
                  }
                  /{group.items.length} completed
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-4">
              {group.items.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {formatLabel(item.type)}
                        </span>
                        <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                          {formatLabel(item.status)}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                      <Link
                        href={item.actionPath}
                        className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Open task
                      </Link>
                    </div>
                    <LearningPathActions itemId={item.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function formatLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
