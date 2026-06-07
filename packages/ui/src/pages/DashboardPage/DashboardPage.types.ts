import type {
  DashboardEnglishImprovementView,
  DashboardInterviewSessionView,
  DashboardMetricView,
  DashboardNoteSummaryView,
  DashboardPageView,
  DashboardProgress,
  DashboardQuickActionView,
  DashboardStudyProgressView,
  DashboardWeakConceptView,
} from '@interviewos/types'

export type DashboardPageProps = {
  loading?: boolean
  empty?: boolean
  error?: string
  progress?: DashboardProgress
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

export type DashboardStudyProgress = DashboardStudyProgressView
export type DashboardQuickAction = DashboardQuickActionView
export type DashboardNoteSummary = DashboardNoteSummaryView
export type DashboardWeakConcept = DashboardWeakConceptView
export type DashboardInterviewSession = DashboardInterviewSessionView
export type DashboardEnglishImprovement = DashboardEnglishImprovementView

export type DashboardFixture = DashboardPageView & {
  focusChips: DashboardFocusChip[]
  primaryAction: DashboardPrimaryAction
}
