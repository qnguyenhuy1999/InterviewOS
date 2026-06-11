'use client'

import { RouteErrorState } from '@/app/_components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteErrorState
      title="Failed to load review queue"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.review}
      backLabel="Review"
    />
  )
}
