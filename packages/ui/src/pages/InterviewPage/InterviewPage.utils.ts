import { format, isToday, isYesterday } from 'date-fns'

import {
  INTERVIEW_PAGE_ALL_TOPICS_VALUE,
  INTERVIEW_PAGE_TYPE_LABELS,
} from './InterviewPage.constants'
import type { InterviewPageSession } from './InterviewPage.types'

export function getInterviewTopicLabel(session: InterviewPageSession) {
  return session.note?.title ?? INTERVIEW_PAGE_TYPE_LABELS[session.type]
}

export function getInterviewTopicOptions(sessions: InterviewPageSession[]) {
  const topics = new Set(sessions.map(getInterviewTopicLabel))

  return [
    { value: INTERVIEW_PAGE_ALL_TOPICS_VALUE, label: 'All topics' },
    ...Array.from(topics).map((topic) => ({ value: topic, label: topic })),
  ]
}

export function filterInterviewSessions(sessions: InterviewPageSession[], selectedTopic: string) {
  if (selectedTopic === INTERVIEW_PAGE_ALL_TOPICS_VALUE) {
    return sessions
  }

  return sessions.filter((session) => getInterviewTopicLabel(session) === selectedTopic)
}

export function formatInterviewDateLabel(date: Date | null) {
  if (date === null) {
    return 'Not started'
  }

  if (isToday(date)) {
    return `Today, ${format(date, 'HH:mm')}`
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'HH:mm')}`
  }

  return format(date, 'MMM d, HH:mm')
}

export function formatInterviewDurationLabel(durationMinutes: number) {
  return `${durationMinutes} min`
}

export function formatInterviewScore(score: number | null) {
  return score === null ? 'N/A' : String(score)
}
