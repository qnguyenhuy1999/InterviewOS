import type { LearningPathItem } from '@interviewos/types'

export type LearningPathPageProps = {
  items?: LearningPathItem[]
  loading?: boolean
  empty?: boolean
  error?: string
}

export type LearningPathFixture = {
  items: LearningPathItem[]
}
