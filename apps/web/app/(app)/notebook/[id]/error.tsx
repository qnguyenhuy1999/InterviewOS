'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type NotebookDetailErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function NotebookDetailError({ error, reset }: NotebookDetailErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load notebook detail"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.notebook}
      backLabel="Notebook"
    />
  )
}
