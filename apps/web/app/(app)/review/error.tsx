'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type ReviewErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ReviewError({ error, reset }: ReviewErrorProps) {
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
