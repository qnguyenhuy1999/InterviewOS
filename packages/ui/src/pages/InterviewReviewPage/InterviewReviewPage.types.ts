import type {
  InterviewEvaluation,
  InterviewReadinessImpact,
  InterviewSummary,
  InterviewType,
} from '@interviewos/types'

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

export type InterviewReviewPageState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ready'
      session: InterviewReviewPageSession
      turns: InterviewReviewPageTurn[]
      evaluation?: InterviewEvaluation | null
    }

export type InterviewReviewPageProps = {
  state?: InterviewReviewPageState
  session?: InterviewReviewPageSession | null
  turns?: InterviewReviewPageTurn[]
  evaluation?: InterviewEvaluation | null
  loading?: boolean
  error?: string
  sessionHref?: string
  allSessionsHref?: string
}

export type InterviewReviewPageFixture = {
  session: InterviewReviewPageSession
  turns: InterviewReviewPageTurn[]
  evaluation: InterviewEvaluation
}
