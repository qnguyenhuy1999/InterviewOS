'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type InterviewReviewErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function InterviewReviewError({ error, reset }: InterviewReviewErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load interview review"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.interview}
      backLabel="All sessions"
    />
  )
}
