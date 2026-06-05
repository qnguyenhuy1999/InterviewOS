import type { InterviewSessionDetail } from '@interviewos/types'

export type InterviewPageSession = Pick<
  InterviewSessionDetail,
  'id' | 'type' | 'startedAt' | 'endedAt' | 'note'
> & {
  metrics: {
    overallScore: number | null
    technicalScore: number | null
    englishScore: number | null
    durationMinutes: number
  }
}

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
