import { WeakConceptStatus } from '@interviewos/types'

import { StatusTrend } from './DashboardPage.types'

export const DASHBOARD_SCORE_TONE = {
  high: 'border-destructive/30 bg-destructive/10 text-destructive',
  medium: 'border-warning/30 bg-warning-soft text-warning',
  low: 'border-border bg-muted text-muted-foreground',
} as const

export const STATUS_META: Record<
  string,
  {
    label: string
    trend: StatusTrend
    badgeClass: string
  }
> = {
  [WeakConceptStatus.ACTIVE]: {
    label: 'Active',
    trend: 'down',
    badgeClass: 'border-destructive/30 bg-error-soft text-destructive',
  },
  [WeakConceptStatus.IMPROVING]: {
    label: 'Improving',
    trend: 'up',
    badgeClass: 'border-warning/30 bg-warning-soft text-warning',
  },
  [WeakConceptStatus.RESOLVED]: {
    label: 'Resolved',
    trend: 'up',
    badgeClass: 'border-success/30 bg-success-soft text-success',
  },
  [WeakConceptStatus.IGNORED]: {
    label: 'Ignored',
    trend: 'stable',
    badgeClass: 'border-border bg-muted text-muted-foreground',
  },
}

export const TREND_LABEL = {
  up: 'Improving',
  down: 'Needs attention',
  stable: 'Steady',
} as const

export const TREND_COLOR = {
  up: 'text-success',
  down: 'text-destructive',
  stable: 'text-muted-foreground',
} as const
