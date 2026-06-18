import { cn } from '../../../lib/utils'
import { DASHBOARD_SCORE_TONE } from './DashboardPage.constants'
import { DashboardMetric, ReadyDashboardState } from './DashboardPage.types'

export function getDashboardToneClass(tone: keyof typeof DASHBOARD_SCORE_TONE) {
  return cn(
    'inline-flex min-w-14 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
    DASHBOARD_SCORE_TONE[tone],
  )
}

export function formatPercent(value: number) {
  return `${Math.round(value > 1 ? value : value * 100)}%`
}

export function missLabel(count: number) {
  return `${count} recent ${count === 1 ? 'miss' : 'misses'}`
}

export function getDashboardMetrics(state: ReadyDashboardState): DashboardMetric[] {
  return [
    {
      label: 'Interview readiness',
      value: String(state.progress.interviewReadiness),
      hint: 'Completed interviews + latest readiness snapshot.',
    },
    {
      label: 'Technical mastery',
      value: String(state.progress.technicalMastery),
      hint: 'Weighted from reviewed notes and weak-concept status.',
    },
    {
      label: 'English score',
      value: String(state.progress.englishScore),
      hint: 'Spoken feedback captured during interview practice.',
    },
    {
      label: 'Review streak',
      value: String(state.progress.reviewStreak),
      hint: `${state.progress.dueReviews} items currently due.`,
    },
    {
      label: 'Questions practiced',
      value: String(state.progress.questionsPracticed),
      hint: 'Completed answers across your current history.',
    },
    {
      label: 'Notes mastered',
      value: String(state.progress.notesMastered),
      hint: 'Entries that have graduated past review.',
    },
  ]
}
