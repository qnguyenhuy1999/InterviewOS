import type { NoteStatus, NoteType, QuestionDifficulty, TechnicalNote } from '@interviewos/types'

export type NotebookPageView = 'grid' | 'list'

export type NotebookPageFilterValue<T extends string> = T | 'ALL'

export type NotebookPageNote = TechnicalNote & {
  questionCount: number
  difficulty: QuestionDifficulty
}

export type NotebookPageProps = {
  notes?: NotebookPageNote[]
  loading?: boolean
  empty?: boolean
  error?: string
  searchValue?: string
  selectedTopic?: string | 'ALL'
  selectedStatus?: NotebookPageFilterValue<NoteStatus>
  selectedType?: NotebookPageFilterValue<NoteType>
  view?: NotebookPageView
}

export type NotebookFixture = {
  notes: NotebookPageNote[]
}
