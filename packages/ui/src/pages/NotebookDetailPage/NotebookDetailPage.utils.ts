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

export type NotebookDetailArticleSection = {
  key:
    | 'summary'
    | NotebookDetailContentSectionKey
    | 'mentalModel'
    | 'interviewAnswer'
  id: string
  title: string
  description?: string
  content?: string
  items?: string[]
  collapsible?: boolean
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

export function getNotebookDetailArticleSections(note: TechnicalNote): NotebookDetailArticleSection[] {
  const content = note.structuredContent

  if (!content) {
    return []
  }

  const sections: NotebookDetailArticleSection[] = [
    {
      key: 'summary',
      id: 'summary',
      title: 'Quick summary',
      description: 'The shortest version of what this note is teaching.',
      content: content.summary ?? content.purpose,
    },
    {
      key: 'coreConcepts',
      id: 'core-concepts',
      title: 'Core concepts',
      description: 'The concepts you should be able to explain without hesitation.',
      items: content.coreConcepts,
    },
    {
      key: 'mentalModel',
      id: 'mental-model',
      title: 'Mental model',
      description: 'A framing you can reuse during interviews and implementation.',
      content: content.mentalModel,
    },
    {
      key: 'practicalExamples',
      id: 'practical-examples',
      title: 'Practical examples',
      items: content.practicalExamples,
      collapsible: true,
    },
    {
      key: 'productionUsage',
      id: 'production-usage',
      title: 'Production usage',
      items: content.productionUsage,
      collapsible: true,
    },
    {
      key: 'commonPitfalls',
      id: 'common-pitfalls',
      title: 'Common pitfalls',
      items: content.commonPitfalls,
    },
    {
      key: 'debuggingChecklist',
      id: 'debugging-checklist',
      title: 'Debugging checklist',
      items: content.debuggingChecklist,
      collapsible: true,
    },
    {
      key: 'productionChecklist',
      id: 'production-checklist',
      title: 'Production checklist',
      items: content.productionChecklist,
      collapsible: true,
    },
    {
      key: 'seniorInterviewSignals',
      id: 'senior-interview-signals',
      title: 'Senior interview signals',
      description: 'The higher-order framing that separates strong answers from memorized ones.',
      items: content.seniorInterviewSignals,
      collapsible: true,
    },
    {
      key: 'interviewAnswer',
      id: 'interview-answer',
      title: 'Interview-ready answer',
      description: 'A concise answer you can rehearse out loud.',
      content: getNotebookDetailInterviewAnswer({ note }),
    },
  ]

  return sections.filter((section) => {
    if (section.content) {
      return section.content.trim().length > 0
    }

    return (section.items?.length ?? 0) > 0
  })
}

export function getNotebookDetailEstimatedReadingTimeLabel(data: {
  note: Pick<TechnicalNote, 'rawInput' | 'structuredContent'>
  questionCount?: number
}) {
  const content = data.note.structuredContent
  const text = [
    data.note.rawInput,
    content?.purpose,
    content?.summary,
    content?.mentalModel,
    content?.directAnswer,
    ...(content?.quickReference ?? []),
    ...(content?.coreConcepts ?? []),
    ...(content?.productionUsage ?? []),
    ...(content?.practicalExamples ?? []),
    ...(content?.commonPitfalls ?? []),
    ...(content?.debuggingChecklist ?? []),
    ...(content?.productionChecklist ?? []),
    ...(content?.seniorInterviewSignals ?? []),
    ...(content?.internals ?? []),
    ...(content?.edgeCases ?? []),
    ...(content?.tradeoffs ?? []),
    ...(content?.commonMistakes ?? []),
    ...(content?.interviewFollowUps ?? []),
  ]
    .filter(Boolean)
    .join(' ')

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 120))

  return `${minutes} min read`
}

export function getNotebookDetailInterviewAnswer(data: {
  note: Pick<TechnicalNote, 'structuredContent' | 'title'>
}) {
  const content = data.note.structuredContent

  if (!content) {
    return 'Generate structured content to create an interview-ready answer.'
  }

  if (content.directAnswer?.trim()) {
    return content.directAnswer.trim()
  }

  const conceptLead = content.coreConcepts[0]
  const pitfallLead =
    content.commonMistakes?.[0] ??
    content.commonPitfalls[0]
  const productionLead = content.productionChecklist[0] ?? content.quickReference[2]

  return [
    content.purpose,
    content.mentalModel,
    conceptLead
      ? `A strong answer should connect this to ${conceptLead.toLowerCase()}.`
      : null,
    productionLead
      ? `Mention ${productionLead.toLowerCase()} to show production awareness.`
      : null,
    pitfallLead ? `Call out ${pitfallLead.toLowerCase()} as a common mistake.` : null,
  ]
    .filter(Boolean)
    .join(' ')
}
