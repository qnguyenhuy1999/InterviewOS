import { NoteStatus, NoteType } from '@interviewos/types'

import type { NotebookPageFilterValue, NotebookPageSort } from './NotebookPage.types'

export const NOTEBOOK_STATUS_OPTIONS = [
  'ALL',
  ...Object.values(NoteStatus),
] as const satisfies readonly NotebookPageFilterValue<NoteStatus>[]

export const NOTEBOOK_TYPE_OPTIONS = [
  'ALL',
  ...Object.values(NoteType),
] as const satisfies readonly NotebookPageFilterValue<NoteType>[]

export const NOTEBOOK_SORT_OPTIONS = [
  'updated-desc',
  'updated-asc',
  'questions-desc',
  'questions-asc',
  'title-asc',
] as const satisfies readonly NotebookPageSort[]

export const NOTEBOOK_DIFFICULTY_TONE = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'hard',
} as const

export const NOTEBOOK_STATUS_DOT = {
  DRAFT: 'draft',
  GENERATING: 'in_progress',
  REVIEWING: 'in_progress',
  NEEDS_PRACTICE: 'todo',
  INTERVIEW_READY: 'ready',
  MASTERED: 'reviewed',
  PUBLISHED: 'done',
  ARCHIVED: 'locked',
} as const

export const SORT_LABELS: Record<NotebookPageSort, string> = {
  'updated-desc': 'Latest updates',
  'updated-asc': 'Oldest updates',
  'questions-desc': 'Most questions',
  'questions-asc': 'Fewest questions',
  'title-asc': 'Title A-Z',
} as const
