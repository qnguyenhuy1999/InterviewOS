import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'

type LearningPathBadge = {
  label: React.ReactNode
  variant?: React.ComponentProps<typeof Badge>['variant']
  className?: string
}

type LearningPathListItemProps = {
  badges?: LearningPathBadge[]
  title: React.ReactNode
  description?: React.ReactNode
  priorityValue: React.ReactNode
  priorityLabel?: React.ReactNode
  footer?: React.ReactNode
  action?: React.ReactNode
}

function LearningPathListItem({
  badges = [],
  title,
  description,
  priorityValue,
  priorityLabel = 'Priority',
  footer,
  action,
}: LearningPathListItemProps) {
  return (
    <article className="rounded-2xl border border-border/80 bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          {badges.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant ?? 'outline'} className={badge.className}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          ) : null}
          <p className="text-base font-semibold">{title}</p>
          {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {priorityLabel}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{priorityValue}</p>
        </div>
      </div>
      {(footer || action) ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">{footer}</div>
          {action}
        </div>
      ) : null}
    </article>
  )
}

export { LearningPathListItem }
