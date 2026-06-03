import type { EnglishNote } from '@interviewos/types'

import { EmptyState } from '@/components/empty-states/EmptyState'
import { apiClient } from '@/lib/api-client'

export default async function EnglishNotesPage() {
  const notes = await apiClient<EnglishNote[]>('/english-notes').catch(() => [])

  if (notes.length === 0) {
    return (
      <EmptyState
        title="No English notes yet"
        description="Your English corrections and vocabulary will appear here after interview sessions."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        }
      />
    )
  }

  return (
    <div className="grid gap-4">
      {notes.map((note) => (
        <div key={note.id} className="rounded-xl border border-border bg-card p-4">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Your sentence</p>
              <p className="text-muted-foreground">{note.originalSentence}</p>
            </div>
            <div>
              <p className="font-medium">Corrected sentence</p>
              <p className="text-muted-foreground">{note.correctedSentence}</p>
            </div>
            <div>
              <p className="font-medium">Natural version</p>
              <p className="text-muted-foreground">{note.naturalVersion}</p>
            </div>
            <div>
              <p className="font-medium">Explanation</p>
              <p className="text-muted-foreground">{note.explanation}</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {note.grammarTopic}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
