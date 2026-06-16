'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type NotebookErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function NotebookError({ error, reset }: NotebookErrorProps) {
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
