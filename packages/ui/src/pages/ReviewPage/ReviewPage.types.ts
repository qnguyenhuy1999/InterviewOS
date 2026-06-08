import type { ReviewPageView } from '@interviewos/types'
import type React from 'react'

export type ReviewPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: ReviewPageView }

export type ReviewPageProps = {
  state: ReviewPageState
  retryHref?: string
  startStudyHref: string
  renderRatingActions?: (
    item: NonNullable<Extract<ReviewPageState, { kind: 'ready' }>['data']>['queue'][number],
  ) => React.ReactNode
  renderLearningPathActions?: (
    item: NonNullable<Extract<ReviewPageState, { kind: 'ready' }>['data']>['learningPath'][number],
  ) => React.ReactNode
  renderWeakConceptActions?: (
    concept: NonNullable<Extract<ReviewPageState, { kind: 'ready' }>['data']>['weakConcepts'][number],
  ) => React.ReactNode
}

export type ReviewPageFixture = ReviewPageView
