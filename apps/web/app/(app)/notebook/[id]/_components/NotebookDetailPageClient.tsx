'use client'

import { API_ROUTES } from '@interviewos/config'
import { NoteStatus, type TechnicalNoteDetailView } from '@interviewos/types'
import NotebookDetailPage from '@interviewos/ui/pages/NotebookDetailPage'

import { NoteActions } from '@/app/_components/forms/NoteActions'
import { StartPracticeButton } from '@/app/_components/forms/StartPracticeButton'
import { StatusSelect } from '@/app/_components/forms/StatusSelect'

type NotebookDetailPageClientProps = {
  data?: TechnicalNoteDetailView
  empty?: boolean
  error?: string
}

export function NotebookDetailPageClient({
  data,
  empty,
  error,
}: NotebookDetailPageClientProps) {
  return (
    <NotebookDetailPage
      data={data}
      empty={empty}
      error={error}
      renderHeaderActions={(note) => (
        <>
          <StatusSelect
            endpoint={API_ROUTES.notes.byId(note.id)}
            value={note.status}
            options={Object.values(NoteStatus)}
          />
          <NoteActions noteId={note.id} canGenerateQuestions={Boolean(note.structuredContent)} />
        </>
      )}
      renderQuestionActions={(questionId) => (
        <StartPracticeButton generatedQuestionId={questionId} />
      )}
    />
  )
}
