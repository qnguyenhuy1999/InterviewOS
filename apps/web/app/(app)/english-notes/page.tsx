import type { EnglishNote } from '@interviewos/types'
import { EnglishNoteStatus } from '@interviewos/types'
import { EnglishNotesPage } from '@interviewos/ui'

import { StatusSelect } from '@/components/forms/StatusSelect'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const notes = await serverApiClient<EnglishNote[]>('/english-notes').catch(
    () => [] as EnglishNote[],
  )

  return (
    <EnglishNotesPage
      notes={notes.length > 0 ? notes : undefined}
      empty={notes.length === 0}
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
