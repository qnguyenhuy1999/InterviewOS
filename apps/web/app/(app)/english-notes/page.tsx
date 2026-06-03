import type { EnglishNote } from '@interviewos/types'

import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

export default async function EnglishNotesPage() {
  const notes = await serverApiClient<EnglishNote[]>('/english-notes').catch(() => [])

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium">{note.originalSentence}</p>
          <p className="mt-2 text-sm text-muted-foreground">Corrected: {note.correctedSentence}</p>
          <p className="text-sm text-muted-foreground">Natural: {note.naturalVersion}</p>
          <p className="text-sm text-muted-foreground">Topic: {note.grammarTopic}</p>
          <p className="mt-2 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
        </div>
      ))}
    </div>
  )
}
