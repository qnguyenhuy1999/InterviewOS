import { EnglishNoteStatus } from '@interviewos/types'

export const ENGLISH_NOTES_STATUS_LABEL: Record<EnglishNoteStatus, string> = {
  [EnglishNoteStatus.NEEDS_PRACTICE]: 'Needs practice',
  [EnglishNoteStatus.REVIEWING]: 'Reviewing',
  [EnglishNoteStatus.IMPROVED]: 'Improved',
  [EnglishNoteStatus.MASTERED]: 'Mastered',
}
