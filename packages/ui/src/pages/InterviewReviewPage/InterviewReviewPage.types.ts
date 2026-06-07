import type { InterviewEvaluation, InterviewReadinessImpact, InterviewSummary, InterviewType } from '@interviewos/types'

export type InterviewReviewPageTurn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
  topicTags?: string[]
  reasoning?: string | null
}

export type InterviewReviewPageSession = {
  id: string
  type: InterviewType
  status: string
  createdAt: Date
  endedAt: Date | null
  readinessImpact?: InterviewReadinessImpact | null
  summary?: InterviewSummary | null
}

export type InterviewReviewPageProps = {
  session?: InterviewReviewPageSession | null
  turns?: InterviewReviewPageTurn[]
  evaluation?: InterviewEvaluation | null
  loading?: boolean
  error?: string
}
