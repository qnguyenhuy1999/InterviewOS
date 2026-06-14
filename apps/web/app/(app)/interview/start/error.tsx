'use client'

import { RouteErrorState } from '@/app/_components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

type InterviewStartErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function InterviewStartError({ error, reset }: InterviewStartErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load interview setup"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.interview}
      backLabel="All sessions"
    />
  )
}
