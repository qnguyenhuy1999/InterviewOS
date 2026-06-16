import type { EnglishNote } from '@interviewos/types'

import { APP_ROUTES } from '@/lib/app-routes'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

import EnglishNotesPageClient from './EnglishNotesPageClient'

export default async function Page() {
  const state = await loadRouteData(() => serverApiClient<EnglishNote[]>('/english-notes'), {
    fallbackMessage: 'Unable to load English notes.',
    isEmpty: (notes) => notes.length === 0,
  })

  return (
    <EnglishNotesPageClient
      state={state.kind === 'ready' ? { kind: 'ready', notes: state.data } : state}
      actions={{
        reviewLatestHref: APP_ROUTES.review,
        startPracticeHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        retryHref: APP_ROUTES.englishNotes,
      }}
    />
  )
}
