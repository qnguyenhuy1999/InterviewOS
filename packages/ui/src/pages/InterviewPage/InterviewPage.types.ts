import type { InterviewSessionListView } from '@interviewos/types'

export type InterviewPageSession = InterviewSessionListView

export type InterviewPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; sessions: InterviewPageSession[] }

export type InterviewPageActions = {
  startInterviewHref: string
  quickStartHref: string
  reviewHref: string
  retryHref?: string
}

export type InterviewPageProps = {
  state: InterviewPageState
  actions: InterviewPageActions
  selectedTopic?: string
  onTopicChange?: (topic: string) => void
}

export type InterviewPageFixture = {
  sessions: InterviewPageSession[]
  selectedTopic: string
}
