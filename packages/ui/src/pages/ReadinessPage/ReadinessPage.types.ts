import type {
  ReadinessHistoryView,
  ReadinessPageView,
  ReadinessSnapshot,
  ScoreBreakdown,
} from '@interviewos/types'

export type ReadinessPageProps = {
  data?: ReadinessPageView
  loading?: boolean
  empty?: boolean
  error?: string
}

export type ReadinessSnapshotView = ReadinessSnapshot
export type ReadinessDimension = ScoreBreakdown
export type ReadinessHistoryItem = ReadinessHistoryView
export type ReadinessPageFixture = ReadinessPageView
