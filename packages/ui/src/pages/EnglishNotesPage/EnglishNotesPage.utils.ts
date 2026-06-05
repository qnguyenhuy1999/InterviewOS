import { type EnglishNote,EnglishNoteStatus } from '@interviewos/types'
import { formatDistanceToNowStrict } from 'date-fns'

export type EnglishTopicGroup = {
  name: string
  notes: EnglishNote[]
  total: number
  mastered: number
  needsPractice: number
  masteryPercentage: number
}

export function getEnglishTopicGroups(notes: EnglishNote[]): EnglishTopicGroup[] {
  const grouped = new Map<string, EnglishNote[]>()

  for (const note of notes) {
    const topic = note.grammarTopic.trim() || 'Other'
    const current = grouped.get(topic)

    if (current) {
      current.push(note)
      continue
    }

    grouped.set(topic, [note])
  }

  return Array.from(grouped.entries())
    .map(([name, topicNotes]) => {
      const mastered = topicNotes.filter((note) => note.status === EnglishNoteStatus.MASTERED).length
      const needsPractice = topicNotes.filter(
        (note) => note.status === EnglishNoteStatus.NEEDS_PRACTICE,
      ).length

      return {
        name,
        notes: topicNotes,
        total: topicNotes.length,
        mastered,
        needsPractice,
        masteryPercentage: Math.round((mastered / topicNotes.length) * 100),
      }
    })
    .sort((left, right) => right.total - left.total || left.name.localeCompare(right.name))
}

export function getEnglishMasteryPercentage(notes: EnglishNote[]): number {
  if (notes.length === 0) {
    return 0
  }

  const masteredCount = notes.filter((note) => note.status === EnglishNoteStatus.MASTERED).length

  return Math.round((masteredCount / notes.length) * 100)
}

export function getEnglishStatusClassName(status: EnglishNoteStatus): string {
  switch (status) {
    case EnglishNoteStatus.MASTERED:
      return 'border-success/30 bg-success-soft text-success'
    case EnglishNoteStatus.IMPROVED:
      return 'border-primary/20 bg-primary/10 text-primary'
    case EnglishNoteStatus.REVIEWING:
      return 'border-warning/30 bg-warning-soft text-warning'
    case EnglishNoteStatus.NEEDS_PRACTICE:
    default:
      return 'border-destructive/30 bg-destructive/10 text-destructive'
  }
}

export function getEnglishRelativeDateLabel(value: Date): string {
  return formatDistanceToNowStrict(value, { addSuffix: true })
}
