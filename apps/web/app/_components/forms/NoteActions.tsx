'use client'

import { API_ROUTES } from '@interviewos/config'
import { NoteActions as NoteActionsUI } from '@interviewos/ui/organisms/NoteActions'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function NoteActions({
  noteId,
  canGenerateQuestions,
}: {
  noteId: string
  canGenerateQuestions: boolean
}) {
  const router = useRouter()

  async function handleGenerateNote() {
    const response = await apiFetch(API_ROUTES.notes.generate(noteId), {
      method: 'POST',
      body: JSON.stringify({}),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  async function handleGenerateQuestions() {
    const response = await apiFetch(API_ROUTES.notes.questions(noteId), {
      method: 'POST',
      body: JSON.stringify({ count: 5 }),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return (
    <NoteActionsUI
      canGenerateQuestions={canGenerateQuestions}
      editNoteHref={`/notebook/${noteId}/edit`}
      onGenerateNote={handleGenerateNote}
      onGenerateQuestions={handleGenerateQuestions}
    />
  )
}
