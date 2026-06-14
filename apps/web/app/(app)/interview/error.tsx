'use client'

import { RouteErrorState } from '@/app/_components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

type InterviewErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function InterviewError({ error, reset }: InterviewErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load interview sessions"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.interview}
      backLabel="All sessions"
    />
  )
}
