import type { ReviewPageView } from '@interviewos/types'

export type ReviewPageProps = {
  data?: ReviewPageView
  loading?: boolean
  empty?: boolean
  error?: string
}

export type ReviewPageFixture = ReviewPageView
