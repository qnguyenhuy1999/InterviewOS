import type { InterviewSessionListView } from '@interviewos/types'

export type InterviewPageSession = InterviewSessionListView

export type InterviewPageProps = {
  loading?: boolean
  empty?: boolean
  error?: string
  sessions?: InterviewPageSession[]
  selectedTopic?: string
  onTopicChange?: (topic: string) => void
}

export type InterviewPageFixture = {
  sessions: InterviewPageSession[]
  selectedTopic: string
}
