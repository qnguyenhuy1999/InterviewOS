import type {
  DashboardEnglishImprovementView,
  DashboardInterviewSessionView,
  DashboardMetricView,
  DashboardNoteSummaryView,
  DashboardPageView,
  DashboardQuickActionView,
  DashboardStudyProgressView,
  DashboardWeakConceptView,
} from '@interviewos/types'

export type DashboardPageProps = {
  loading?: boolean
  empty?: boolean
  error?: string
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
