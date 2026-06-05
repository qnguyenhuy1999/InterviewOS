import { type LearningPathItem,LearningPathItemStatus } from '@interviewos/types'

import { LEARNING_PATH_STATUS_GROUPS } from './LearningPathPage.constants'

export function formatLearningPathLabel(value: string): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getLearningPathProgress(items: LearningPathItem[]): number {
  if (items.length === 0) {
    return 0
  }

  const completedCount = items.filter(
    (item) => item.status === LearningPathItemStatus.COMPLETED,
  ).length

  return Math.round((completedCount / items.length) * 100)
}

export function getLearningPathStatusGroups(items: LearningPathItem[]) {
  return LEARNING_PATH_STATUS_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => group.statuses.some((status) => status === item.status)),
  })).filter((group) => group.items.length > 0)
}

export function getLearningPathTypeSummaries(items: LearningPathItem[]) {
  return Array.from(
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
}

export function getLearningPathStatusClassName(status: LearningPathItemStatus): string {
  switch (status) {
    case LearningPathItemStatus.COMPLETED:
      return 'border-success/30 bg-success-soft text-success'
    case LearningPathItemStatus.IN_PROGRESS:
      return 'border-primary/20 bg-primary/10 text-primary'
    case LearningPathItemStatus.SNOOZED:
    case LearningPathItemStatus.SKIPPED:
      return 'border-border bg-muted text-muted-foreground'
    case LearningPathItemStatus.PENDING:
    default:
      return 'border-warning/30 bg-warning-soft text-warning'
  }
}
