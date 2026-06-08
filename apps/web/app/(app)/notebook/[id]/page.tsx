import { API_ROUTES } from '@interviewos/config'
import { NoteStatus, type TechnicalNoteDetailView } from '@interviewos/types'
import NotebookDetailPage from '@interviewos/ui/pages/NotebookDetailPage'

import { NoteActions } from '@/components/forms/NoteActions'
import { StartPracticeButton } from '@/components/forms/StartPracticeButton'
import { StatusSelect } from '@/components/forms/StatusSelect'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const state = await loadRouteData(
    () => serverApiClient<TechnicalNoteDetailView>(API_ROUTES.notes.byId(id)),
    { fallbackMessage: 'Unable to load this notebook entry.' },
  )

  return (
    <NotebookDetailPage
      data={state.kind === 'ready' ? state.data : undefined}
      empty={state.kind === 'empty'}
      error={state.kind === 'error' ? state.message : undefined}
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
