'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type InterviewSessionErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function InterviewSessionError({ error, reset }: InterviewSessionErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load interview session"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.interview}
      backLabel="All sessions"
    />
  )
}
