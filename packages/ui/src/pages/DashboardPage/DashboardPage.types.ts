export type DashboardPageProps = {
  loading?: boolean
  empty?: boolean
  error?: string
}

export type DashboardMetric = {
  label: string
  value: string
  hint: string
}

export type DashboardFocusChip = {
  label: string
}

export type DashboardPrimaryAction = {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
}

export type DashboardStudyProgress = {
  title: string
  description: string
  topic: string
  progressLabel: string
  progressValue: number
  ctaLabel: string
}

export type DashboardQuickAction = {
  label: string
}

export type DashboardNoteSummary = {
  id: string
  title: string
  domain: string
  updatedLabel: string
  difficulty: 'Hard' | 'Medium' | 'Low'
}

export type DashboardWeakConcept = {
  id: string
  title: string
  subtitle: string
  severity: 'High' | 'Medium' | 'Low'
}

export type DashboardInterviewSession = {
  id: string
  score: number
  title: string
  meta: string
  techScore: number
  englishScore: number
}

export type DashboardEnglishImprovement = {
  id: string
  title: string
  subtitle: string
}

export type DashboardFixture = {
  greeting: string
  subtitle: string
  reviewQueueLabel: string
  metrics: DashboardMetric[]
  focusChips: DashboardFocusChip[]
  primaryAction: DashboardPrimaryAction
  studyProgress: DashboardStudyProgress
  quickActions: DashboardQuickAction[]
  notes: DashboardNoteSummary[]
  weakConcepts: DashboardWeakConcept[]
  sessions: DashboardInterviewSession[]
  englishImprovements: DashboardEnglishImprovement[]
}
