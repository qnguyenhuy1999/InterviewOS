'use client'

import { API_ROUTES } from '@interviewos/config'
import type { TechnicalNote, UserLearningProfile } from '@interviewos/types'
import { NoteForm as NoteFormUI } from '@interviewos/ui/organisms/NoteForm'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function NoteForm({
  profile,
  note,
}: {
  profile: UserLearningProfile | null
  note?: TechnicalNote | null
}) {
  const router = useRouter()

  async function handleSubmit(payload: Parameters<React.ComponentProps<typeof NoteFormUI>['onSubmit']>[0]) {
    const response = await apiFetch(
      note ? API_ROUTES.notes.byId(note.id) : API_ROUTES.notes.list,
      {
        method: note ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      },
    )
    if (!response.ok) throw new Error(await response.text())
    const savedNote = (await response.json()) as { id: string }
    router.push(`/notebook/${savedNote.id}`)
  }

  return <NoteFormUI profile={profile} note={note} onSubmit={handleSubmit} />
}
