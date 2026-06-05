import type { NoteStatus } from '@interviewos/types'

export const statusVariant: Record<NoteStatus, 'default' | 'secondary' | 'outline'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  ARCHIVED: 'outline',
  REVIEWING: 'secondary',
  NEEDS_PRACTICE: 'outline',
  INTERVIEW_READY: 'default',
  MASTERED: 'default',
}
