import type { EnglishNote } from '@interviewos/types'

export type EnglishNotesPageProps = {
  notes?: EnglishNote[]
  loading?: boolean
  empty?: boolean
  error?: string
}

export type EnglishNotesFixture = {
  notes: EnglishNote[]
}
