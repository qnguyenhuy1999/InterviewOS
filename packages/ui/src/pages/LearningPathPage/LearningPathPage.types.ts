import type { LearningPathItem } from '@interviewos/types'
import type React from 'react'

export type ReadyLearningPathState = Extract<LearningPathPageState, { kind: 'ready' }>

export type LearningPathPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; items: LearningPathItem[] }

export type LearningPathPageProps = {
  state: LearningPathPageState
  reviewQueueHref: string
  focusModeHref?: string
  retryHref?: string
  renderItemActions?: (item: LearningPathItem) => React.ReactNode
}

export type LearningPathFixture = {
  items: LearningPathItem[]
}
