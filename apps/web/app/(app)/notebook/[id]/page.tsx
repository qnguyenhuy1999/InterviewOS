import { API_ROUTES } from '@interviewos/config'
import {
  type NotebookNoteListItem,
  type NoteGeneratedQuestion,
  type TechnicalNote,
  type TechnicalNoteDetailView,
} from '@interviewos/types'

import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

import { NotebookDetailPageClient } from './_components/NotebookDetailPageClient'

type TechnicalNoteDetailResponse = TechnicalNote & {
  questions: NoteGeneratedQuestion[]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const state = await loadRouteData(
    async () => {
      const [note, notes] = await Promise.all([
        serverApiClient<TechnicalNoteDetailResponse>(API_ROUTES.notes.byId(id)),
        serverApiClient<NotebookNoteListItem[]>(API_ROUTES.notes.list),
      ])

      const noteTopic = note.topic?.trim().toLowerCase()
      const relatedNotes = notes
        .filter((candidate) => candidate.id !== note.id)
        .filter((candidate) => {
          const candidateTopic = candidate.topic?.trim().toLowerCase()

          if (noteTopic && candidateTopic) {
            return candidateTopic === noteTopic
          }

          return candidate.type === note.type
        })
        .slice(0, 4)
        .map((candidate) => ({
          id: candidate.id,
          title: candidate.title,
          topic: candidate.topic,
          type: candidate.type,
          status: candidate.status,
          updatedAt: candidate.updatedAt,
          questionCount: candidate.questionCount,
        }))

      return {
        note,
        questionCount: note.questions.length,
        generatedQuestions: note.questions,
        relatedNotes,
      } satisfies TechnicalNoteDetailView
    },
    { fallbackMessage: 'Unable to load this notebook entry.' },
  )

  return (
    <NotebookDetailPageClient
      data={state.kind === 'ready' ? state.data : undefined}
      empty={state.kind === 'empty'}
      error={state.kind === 'error' ? state.message : undefined}
    />
  )
}
