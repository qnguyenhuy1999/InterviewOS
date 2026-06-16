'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type DashboardErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load dashboard"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.dashboard}
      backLabel="Dashboard"
    />
  )
}
