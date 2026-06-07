import type { NotebookNoteListItem } from '@interviewos/types'
import { NotebookPage } from '@interviewos/ui'

import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const notes = await serverApiClient<NotebookNoteListItem[]>('/notes').catch(
    () => [] as NotebookNoteListItem[],
  )

  return <NotebookPage notes={notes.length > 0 ? notes : undefined} empty={notes.length === 0} />
}
