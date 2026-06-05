import type { NoteStatus, NoteType, QuestionDifficulty, TechnicalNote } from '@interviewos/types'
import { formatDistanceToNowStrict } from 'date-fns'

import { consoleLayoutNavigationFixture } from '../../layouts/ConsoleLayout/ConsoleLayout.fixtures'
import type { ConsoleLayoutNavGroup } from '../../layouts/ConsoleLayout/ConsoleLayout.types'
import { NOTEBOOK_DIFFICULTY_TONE, NOTEBOOK_STATUS_DOT } from './NotebookPage.constants'
import type {
  NotebookPageFilterValue,
  NotebookPageNote,
  NotebookPageProps,
} from './NotebookPage.types'

export function getNotebookNavigation(): ConsoleLayoutNavGroup[] {
  return consoleLayoutNavigationFixture.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.label === 'Notebook',
    })),
  }))
}

export function getNotebookTopicOptions(notes: NotebookPageNote[]) {
  const topics = Array.from(
    new Set(notes.map((note) => normalizeTopic(note.topic) ?? getEnumLabel(note.type))),
  ).sort((left, right) => left.localeCompare(right))

  return ['ALL', ...topics] as const
}

export function getNotebookSummary(note: TechnicalNote) {
  const base = note.structuredContent?.purpose?.trim() || note.rawInput.trim()
  return base.length > 140 ? `${base.slice(0, 137).trimEnd()}...` : base
}

export function getEnumLabel(value: NoteStatus | NoteType | QuestionDifficulty) {
  return value.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getRelativeUpdatedAtLabel(value: Date) {
  return formatDistanceToNowStrict(value, { addSuffix: true })
}

export function getDifficultyTone(difficulty: QuestionDifficulty) {
  return NOTEBOOK_DIFFICULTY_TONE[difficulty]
}

export function getStatusDot(status: NoteStatus) {
  return NOTEBOOK_STATUS_DOT[status]
}

export function getVisibleNotebookNotes({
  notes,
  empty,
  searchValue,
  selectedTopic = 'ALL',
  selectedStatus = 'ALL',
  selectedType = 'ALL',
}: Pick<
  NotebookPageProps,
  'notes' | 'empty' | 'searchValue' | 'selectedTopic' | 'selectedStatus' | 'selectedType'
>) {
  if (empty) {
    return []
  }

  const normalizedSearch = searchValue?.trim().toLowerCase() ?? ''

  return (notes ?? []).filter((note) => {
    const topicLabel = normalizeTopic(note.topic) ?? getEnumLabel(note.type)

    if (
      normalizedSearch &&
      ![note.title, topicLabel, note.rawInput, getNotebookSummary(note)]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ) {
      return false
    }

    if (selectedTopic !== 'ALL' && topicLabel !== selectedTopic) {
      return false
    }

    if (selectedStatus !== 'ALL' && note.status !== selectedStatus) {
      return false
    }

    if (selectedType !== 'ALL' && note.type !== selectedType) {
      return false
    }

    return true
  })
}

export function isSelectedFilter<T extends string>(
  current: NotebookPageFilterValue<T> | string | undefined,
  expected: NotebookPageFilterValue<T>,
) {
  return (current ?? 'ALL') === expected
}

function normalizeTopic(value: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}
