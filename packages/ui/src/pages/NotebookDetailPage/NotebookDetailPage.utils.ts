import type { NoteGeneratedQuestion, TechnicalNote, TechnicalNoteContent } from '@interviewos/types'

import { consoleLayoutNavigationFixture } from '../../layouts/ConsoleLayout/ConsoleLayout.fixtures'
import type { ConsoleLayoutNavGroup } from '../../layouts/ConsoleLayout/ConsoleLayout.types'
import { NOTEBOOK_DETAIL_CONTENT_SECTIONS } from './NotebookDetailPage.constants'

type NotebookDetailContentSectionKey = (typeof NOTEBOOK_DETAIL_CONTENT_SECTIONS)[number]['key']

export type NotebookDetailContentSection = {
  key: NotebookDetailContentSectionKey
  title: string
  items: string[]
}

export function getNotebookDetailNavigation(): ConsoleLayoutNavGroup[] {
  return consoleLayoutNavigationFixture.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.label === 'Notebook',
    })),
  }))
}

export function getNotebookDetailContentSections(content: TechnicalNoteContent | null) {
  if (!content) {
    return []
  }

  return NOTEBOOK_DETAIL_CONTENT_SECTIONS.map((section) => ({
    key: section.key,
    title: section.title,
    items: content[section.key],
  })).filter((section) => section.items.length > 0)
}

export function getNotebookDetailTopicLabel(note: TechnicalNote) {
  const topic = note.topic?.trim()
  return topic && topic.length > 0 ? topic : 'Uncategorized'
}

export function getNotebookDetailInterviewTargets(note: TechnicalNote) {
  return [
    { label: 'Target role', value: note.overrideRole ?? 'Not specified' },
    { label: 'Target level', value: note.overrideLevel ?? 'Not specified' },
    { label: 'English level', value: note.overrideEnglishLevel ?? 'Not specified' },
    { label: 'Output style', value: note.preferredOutputStyle ?? 'Default' },
  ]
}

export function getNotebookQuestionConceptSummary(question: NoteGeneratedQuestion) {
  return question.expectedConcepts.length > 0
    ? question.expectedConcepts.join(', ')
    : 'Concepts not specified'
}
