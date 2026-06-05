import type { NoteStatus as NoteStatusType, NoteType as NoteTypeType } from '@interviewos/types'

export type Note = {
  id: string
  userId: string
  title: string
  content: string
  noteType: NoteTypeType
  status: NoteStatusType
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type NoteCardProps = {
  note: Note
  onEdit?: () => void
  onDelete?: () => void
  loading?: boolean
}
