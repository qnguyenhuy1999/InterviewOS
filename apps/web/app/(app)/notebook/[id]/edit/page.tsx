import { API_ROUTES } from '@interviewos/config'
import type { TechnicalNote, UserLearningProfile } from '@interviewos/types'
import { NotebookEditPage } from '@interviewos/ui'

import { NoteForm } from '@/app/_components/forms/NoteForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [note, profile] = await Promise.all([
    serverApiClient<TechnicalNote>(API_ROUTES.notes.byId(id)).catch(() => null),
    serverApiClient<UserLearningProfile | null>(API_ROUTES.users.learningProfile).catch(() => null),
  ])

  if (!note) {
    return <NotebookEditPage error="Unable to load this note for editing." />
  }

  return (
    <NotebookEditPage>
      <NoteForm profile={profile} note={note} />
    </NotebookEditPage>
  )
}
