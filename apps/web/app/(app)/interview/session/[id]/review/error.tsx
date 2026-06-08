'use client'

import { RouteErrorState } from '@/components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

export default function InterviewReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
