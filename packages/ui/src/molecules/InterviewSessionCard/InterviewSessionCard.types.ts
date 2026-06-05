import type { InterviewType as InterviewTypeType } from '../../fixtures'

export type InterviewSession = {
  id: string
  userId: string
  interviewType: InterviewTypeType
  startedAt: Date
  endedAt: Date | null
}

export type InterviewCardProps = {
  session: InterviewSession
  questionsAnswered?: number
  totalQuestions?: number
  averageScore?: number
  loading?: boolean
  onResume?: () => void
  onReview?: () => void
}
