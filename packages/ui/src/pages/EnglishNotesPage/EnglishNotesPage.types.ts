import type { EnglishNote } from '@interviewos/types'
import type React from 'react'

export type EnglishNotesPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; notes: EnglishNote[] }

export type EnglishNotesPageActions = {
  reviewLatestHref: string
  startPracticeHref: string
  retryHref?: string
}

export type EnglishNotesPageProps = {
  state: EnglishNotesPageState
  actions: EnglishNotesPageActions
  renderNoteActions?: (note: EnglishNote) => React.ReactNode
}

export type EnglishNotesFixture = {
  notes: EnglishNote[]
}
