import { type EnglishNote,EnglishNoteStatus } from '@interviewos/types'

import { StatusSelect } from '@/components/forms/StatusSelect'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

export default async function EnglishNotesPage() {
  const notes = await serverApiClient<EnglishNote[]>('/english-notes').catch(() => [])

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{note.originalSentence}</p>
              <p className="mt-2 text-sm text-muted-foreground">Corrected: {note.correctedSentence}</p>
              <p className="text-sm text-muted-foreground">Natural: {note.naturalVersion}</p>
              <p className="text-sm text-muted-foreground">Topic: {note.grammarTopic}</p>
              <p className="mt-2 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
            </div>
            <StatusSelect
              endpoint={`/english-notes/${note.id}/status`}
              value={note.status}
              options={Object.values(EnglishNoteStatus)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
