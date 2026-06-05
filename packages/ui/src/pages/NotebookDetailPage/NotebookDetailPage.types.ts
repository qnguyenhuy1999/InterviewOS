import type { TechnicalNoteDetailView } from '@interviewos/types'

export type NotebookDetailPageProps = {
  data?: TechnicalNoteDetailView
  loading?: boolean
  empty?: boolean
  error?: string
}

export type NotebookDetailPageFixture = TechnicalNoteDetailView
