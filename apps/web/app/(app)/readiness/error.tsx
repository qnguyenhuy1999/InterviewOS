'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type ReadinessErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ReadinessError({ error, reset }: ReadinessErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load readiness"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.readiness}
      backLabel="Readiness"
    />
  )
}
