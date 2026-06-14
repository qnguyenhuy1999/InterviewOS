'use client'

import { RouteErrorState } from '@/app/_components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

type ResumeErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ResumeError({ error, reset }: ResumeErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load resume workspace"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.resume}
      backLabel="Resume"
    />
  )
}
