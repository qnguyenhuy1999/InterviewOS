import type { DashboardMetricView, DashboardPageView, DashboardProgress } from '@interviewos/types'

export type DashboardPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ready'
      progress: DashboardProgress
      readiness?: {
        overallScore: number
        confidenceLevel: number
        improvementTrend: number
        breakdown: Array<{
          dimension: string
          label: string
          score: number
          weight: number
          trend: 'UP' | 'DOWN' | 'STABLE'
        }>
      }
    }

export type DashboardPageActions = {
  createNoteHref: string
  startInterviewHref: string
  quickStartHref: string
  allNotesHref: string
  allSessionsHref: string
  englishNotesHref: string
  reviewQueueHref: string
  readinessHref: string
  retryHref?: string
}

export type DashboardPageProps = {
  state: DashboardPageState
  actions: DashboardPageActions
}

export type DashboardMetric = DashboardMetricView

export type DashboardFocusChip = {
  label: string
}

export type DashboardPrimaryAction = {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
}

export type DashboardFixture = DashboardPageView & {
  focusChips: DashboardFocusChip[]
  primaryAction: DashboardPrimaryAction
}
