import type { LearningPathItem } from '@interviewos/types'
import type React from 'react'

export type LearningPathPageProps = {
  items?: LearningPathItem[]
  loading?: boolean
  empty?: boolean
  error?: string
  renderItemActions?: (item: LearningPathItem) => React.ReactNode
}

export type LearningPathFixture = {
  items: LearningPathItem[]
}
