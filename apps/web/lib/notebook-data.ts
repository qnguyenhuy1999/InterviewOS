import type {
  NotebookNoteListItem,
  TechnicalNote,
  TechnicalNoteDetailView,
  TechnicalNoteSummary,
} from '@interviewos/types'

type SerializedDates<T, TKeys extends keyof T> = Omit<T, TKeys> & {
  [K in TKeys]: Date | string
}

type SerializedTechnicalNote = SerializedDates<TechnicalNote, 'createdAt' | 'updatedAt'>
type SerializedNotebookNoteListItem = SerializedDates<
  NotebookNoteListItem,
  'createdAt' | 'updatedAt'
>
type SerializedTechnicalNoteSummary = SerializedDates<TechnicalNoteSummary, 'updatedAt'>

type SerializedNotebookDetailView = Omit<TechnicalNoteDetailView, 'note' | 'relatedNotes'> & {
  note: SerializedTechnicalNote
  relatedNotes: SerializedTechnicalNoteSummary[]
}

export function hydrateNotebookNote(note: SerializedTechnicalNote): TechnicalNote {
  return {
    ...note,
    createdAt: toDate(note.createdAt),
    updatedAt: toDate(note.updatedAt),
  }
}

export function hydrateNotebookNotes(
  notes: SerializedNotebookNoteListItem[],
): NotebookNoteListItem[] {
  return notes.map((note) => ({
    ...note,
    createdAt: toDate(note.createdAt),
    updatedAt: toDate(note.updatedAt),
  }))
}

export function hydrateNotebookDetailView(
  data: SerializedNotebookDetailView,
): TechnicalNoteDetailView {
  return {
    ...data,
    note: hydrateNotebookNote(data.note),
    relatedNotes: data.relatedNotes.map((note) => ({
      ...note,
      updatedAt: toDate(note.updatedAt),
    })),
  }
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}
