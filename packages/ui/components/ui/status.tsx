import type * as React from 'react'

import { cn } from '../../lib/utils'
import { Badge } from './badge'

type Severity = 'low' | 'medium' | 'high'
type Difficulty = 'easy' | 'medium' | 'hard'
type Status =
  | 'draft'
  | 'ready'
  | 'reviewed'
  | 'completed'
  | 'in_progress'
  | 'todo'
  | 'locked'
  | 'done'

const severityClassName: Record<Severity, string> = {
  low: 'border-border bg-muted text-muted-foreground',
  medium: 'border-warning/30 bg-warning-soft text-warning',
  high: 'border-destructive/30 bg-destructive/10 text-destructive',
}

const severityLabel: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function WeaknessBadge({
  severity,
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { severity: Severity }) {
  return (
    <Badge variant="outline" className={cn(severityClassName[severity], className)} {...props}>
      {severityLabel[severity]}
    </Badge>
  )
}

const difficultyClassName: Record<Difficulty, string> = {
  easy: 'border-success/30 bg-success-soft text-success',
  medium: 'border-warning/30 bg-warning-soft text-warning',
  hard: 'border-destructive/30 bg-destructive/10 text-destructive',
}

function DifficultyBadge({
  difficulty,
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { difficulty: Difficulty }) {
  if (!difficulty) {
    return null
  }

  return (
    <Badge variant="outline" className={cn(difficultyClassName[difficulty], className)} {...props}>
      {difficulty[0].toUpperCase() + difficulty.slice(1)}
    </Badge>
  )
}

const statusDotClassName: Record<Status, string> = {
  draft: 'bg-muted-foreground/40',
  ready: 'bg-primary',
  reviewed: 'bg-success',
  completed: 'bg-success',
  in_progress: 'bg-primary',
  todo: 'bg-muted-foreground/40',
  locked: 'bg-muted-foreground/20',
  done: 'bg-success',
}

function StatusDot({
  status,
  className,
  ...props
}: React.ComponentProps<'span'> & { status: Status }) {
  return (
    <span
      data-slot="status-dot"
      data-status={status}
      className={cn('inline-block size-1.5 rounded-full', statusDotClassName[status], className)}
      {...props}
    />
  )
}

export { DifficultyBadge, StatusDot, WeaknessBadge }
