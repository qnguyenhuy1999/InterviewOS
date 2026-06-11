import { API_ROUTES } from '@interviewos/config'
import type { NotebookNoteListItem } from '@interviewos/types'

import { APP_ROUTES } from '@/lib/app-routes'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

import { NotebookPageClient } from './_components/NotebookPageClient'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    topic?: string
    status?: string
    type?: string
    view?: string
  }>
}) {
  const params = await searchParams
  const state = await loadRouteData(
    () => serverApiClient<NotebookNoteListItem[]>(API_ROUTES.notes.list),
    {
      fallbackMessage: 'Unable to load notebook entries.',
      isEmpty: (notes) => notes.length === 0,
    },
  )

  return (
    <NotebookPageClient
      state={state.kind === 'ready' ? { kind: 'ready', notes: state.data } : state}
      actions={{
        createNoteHref: APP_ROUTES.notebookNew,
        noteHrefBase: APP_ROUTES.notebook,
        retryHref: APP_ROUTES.notebook,
      }}
      initialSearchValue={params.q}
      initialSelectedTopic={params.topic?.trim() ? params.topic : 'ALL'}
      initialSelectedStatus={params.status ?? null}
      initialSelectedType={params.type ?? null}
      initialView={params.view === 'list' ? 'list' : 'grid'}
    />
  )
}
