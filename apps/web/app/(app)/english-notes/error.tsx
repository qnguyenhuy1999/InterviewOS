'use client'

import { RouteErrorState } from '@interviewos/ui'

import { APP_ROUTES } from '@/lib/app-routes'

type EnglishNotesErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function EnglishNotesError({ error, reset }: EnglishNotesErrorProps) {
  return (
    <RouteErrorState
      title="Failed to load English notes"
      message={error.message}
      reset={reset}
      backHref={APP_ROUTES.englishNotes}
      backLabel="English notes"
    />
  )
}
