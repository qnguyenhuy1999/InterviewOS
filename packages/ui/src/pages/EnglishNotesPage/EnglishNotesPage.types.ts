import type { EnglishNote } from '@interviewos/types'
import type React from 'react'

export type EnglishNotesPageProps = {
  notes?: EnglishNote[]
  loading?: boolean
  empty?: boolean
  error?: string
  renderNoteActions?: (note: EnglishNote) => React.ReactNode
}

export type EnglishNotesFixture = {
  notes: EnglishNote[]
}
