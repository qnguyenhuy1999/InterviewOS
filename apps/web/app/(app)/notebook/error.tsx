'use client'

import { RouteErrorState } from '@/components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

export default function NotebookError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteErrorState
      title="Failed to load notebook"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.notebook}
      backLabel="Notebook"
    />
  )
}
