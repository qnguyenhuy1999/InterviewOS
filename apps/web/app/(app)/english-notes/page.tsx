import type { EnglishNote } from '@interviewos/types'
import { EnglishNoteStatus } from '@interviewos/types'
import EnglishNotesPage from '@interviewos/ui/pages/EnglishNotesPage'

import { StatusSelect } from '@/app/_components/forms/StatusSelect'
import { APP_ROUTES } from '@/lib/app-routes'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const state = await loadRouteData(() => serverApiClient<EnglishNote[]>('/english-notes'), {
    fallbackMessage: 'Unable to load English notes.',
    isEmpty: (notes) => notes.length === 0,
  })

  return (
    <EnglishNotesPage
      state={state.kind === 'ready' ? { kind: 'ready', notes: state.data } : state}
      actions={{
        reviewLatestHref: APP_ROUTES.review,
        startPracticeHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        retryHref: APP_ROUTES.englishNotes,
      }}
      renderNoteActions={(note) => (
        <StatusSelect
          endpoint={`/english-notes/${note.id}/status`}
          value={note.status}
          options={Object.values(EnglishNoteStatus)}
        />
      )}
    />
  )
}
