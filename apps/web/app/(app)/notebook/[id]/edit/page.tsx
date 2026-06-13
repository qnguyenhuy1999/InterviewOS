import { API_ROUTES } from '@interviewos/config'
import type { TechnicalNote, UserLearningProfile } from '@interviewos/types'

import { NoteForm } from '@/app/_components/forms/NoteForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [note, profile] = await Promise.all([
    serverApiClient<TechnicalNote>(API_ROUTES.notes.byId(id)).catch(() => null),
    serverApiClient<UserLearningProfile | null>(API_ROUTES.users.learningProfile).catch(() => null),
  ])

  if (!note) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this note for editing.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Edit note</h2>
        <p className="text-sm text-muted-foreground">
          Update the note content and decide whether this note should keep its own overrides.
        </p>
      </div>
      <NoteForm profile={profile} note={note} />
    </div>
  )
}
