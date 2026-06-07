import type { TechnicalNote, TechnicalNoteDetailView } from '@interviewos/types'
import type { ReactNode } from 'react'

export type NotebookDetailPageProps = {
  data?: TechnicalNoteDetailView
  loading?: boolean
  empty?: boolean
  error?: string
  renderHeaderActions?: (note: TechnicalNote) => ReactNode
  renderQuestionActions?: (questionId: string) => ReactNode
}

export type NotebookDetailPageFixture = TechnicalNoteDetailView
