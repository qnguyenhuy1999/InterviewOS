import { API_ROUTES } from '@interviewos/config'
import { NoteStatus, type TechnicalNoteDetailView } from '@interviewos/types'
import NotebookDetailPage from '@interviewos/ui/pages/NotebookDetailPage'

import { NoteActions } from '@/components/forms/NoteActions'
import { StartPracticeButton } from '@/components/forms/StartPracticeButton'
import { StatusSelect } from '@/components/forms/StatusSelect'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await serverApiClient<TechnicalNoteDetailView>(API_ROUTES.notes.byId(id)).catch(
    () => null,
  )

  return (
    <NotebookDetailPage
      data={data ?? undefined}
      empty={!data}
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
