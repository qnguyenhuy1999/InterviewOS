import type { NotebookNoteListItem, NoteStatus, NoteType } from '@interviewos/types'
export type NotebookPageView = 'grid' | 'list'
export type NotebookPageSort = 'updated-desc' | 'updated-asc' | 'questions-desc' | 'questions-asc' | 'title-asc'

export type NotebookPageFilterValue<T extends string> = T | 'ALL'

export type NotebookPageNote = NotebookNoteListItem

export type NotebookPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; notes: NotebookPageNote[] }

export type NotebookPageActions = {
  createNoteHref: string
  noteHref: (noteId: string) => string
  noteEditHref?: (noteId: string) => string
  retryHref?: string
}

export type NotebookPageProps = {
  state: NotebookPageState
  actions: NotebookPageActions
  searchValue?: string
  selectedTopic?: string | 'ALL'
  selectedStatus?: NotebookPageFilterValue<NoteStatus>
  selectedType?: NotebookPageFilterValue<NoteType>
  selectedSort?: NotebookPageSort
  view?: NotebookPageView
  onSearchValueChange?: (value: string) => void
  onSelectedTopicChange?: (value: string | 'ALL') => void
  onSelectedStatusChange?: (value: NotebookPageFilterValue<NoteStatus>) => void
  onSelectedTypeChange?: (value: NotebookPageFilterValue<NoteType>) => void
  onSelectedSortChange?: (value: NotebookPageSort) => void
  onViewChange?: (value: NotebookPageView) => void
  onClearFilters?: () => void
}

export type NotebookFixture = {
  notes: NotebookPageNote[]
}
