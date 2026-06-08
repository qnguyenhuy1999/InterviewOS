'use client'

import { RouteErrorState } from '@/components/route-feedback/RouteErrorState'
import { APP_ROUTES } from '@/lib/app-routes'

export default function EnglishNotesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
