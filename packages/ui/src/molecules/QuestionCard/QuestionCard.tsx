import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { DifficultyBadge } from '../../../components/ui/status'

type QuestionCardProps = {
  title: React.ReactNode
  description?: React.ReactNode
  difficulty: 'easy' | 'medium' | 'hard'
  badges?: React.ReactNode[]
  footer?: React.ReactNode
  action?: React.ReactNode
}

function QuestionCard({ title, description, difficulty, badges = [], footer, action }: QuestionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-background px-4 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-pretty text-base leading-6 font-medium text-foreground">{title}</p>
          {description ? (
            <p className="max-w-prose break-words text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 self-start">
          <DifficultyBadge difficulty={difficulty} />
          {action}
        </div>
      </div>
      {badges.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="rounded-full px-2.5 py-0.5 whitespace-normal break-words"
            >
              {badge}
            </Badge>
          ))}
        </div>
      ) : null}
      {footer ? (
        <div className="mt-3 break-words text-xs leading-5 text-muted-foreground">{footer}</div>
      ) : null}
    </div>
  )
}

export { QuestionCard }
