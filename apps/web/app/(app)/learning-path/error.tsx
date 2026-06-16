'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type LearningPathErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LearningPathError({ error, reset }: LearningPathErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load learning path"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.learningPath}
      backLabel="Learning path"
    />
  )
}
