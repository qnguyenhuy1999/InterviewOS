import { API_ROUTES } from '@interviewos/config'
import type { NotebookNoteListItem } from '@interviewos/types'
import NotebookPage from '@interviewos/ui/pages/NotebookPage'

import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const notes = await serverApiClient<NotebookNoteListItem[]>(API_ROUTES.notes.list).catch(
    () => [] as NotebookNoteListItem[],
  )

  return <NotebookPage notes={notes.length > 0 ? notes : undefined} empty={notes.length === 0} />
}
