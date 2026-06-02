import type { NoteStatus, NoteType, QuestionDifficulty } from './enums'

export interface TechnicalNote {
  id: string
  userId: string
  title: string
  content: string
  noteType: NoteType
  status: NoteStatus
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface TechnicalNoteSection {
  id: string
  noteId: string
  heading: string
  content: string
  order: number
}

export interface NoteGeneratedQuestion {
  id: string
  noteId: string
  question: string
  expectedAnswer: string
  difficulty: QuestionDifficulty
}
