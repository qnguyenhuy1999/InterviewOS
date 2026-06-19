import type {
  ReadinessHistoryView,
  ReadinessPageView,
  ReadinessSnapshot,
  ScoreBreakdown,
} from '@interviewos/types'
import type React from 'react'

export type ReadinessPageProps = {
  data?: ReadinessPageView
  loading?: boolean
  empty?: boolean
  error?: string
  retryHref?: string
  startPracticeHref?: string
  renderRecomputeAction?: React.ReactNode
}

export type ReadinessSnapshotView = ReadinessSnapshot
export type ReadinessDimension = ScoreBreakdown
export type ReadinessHistoryItem = ReadinessHistoryView
export type ReadinessPageFixture = ReadinessPageView
