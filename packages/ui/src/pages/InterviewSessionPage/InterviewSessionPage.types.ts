import type { InterviewSessionDetail } from '@interviewos/types'
import type * as React from 'react'

export type InterviewSessionPageTurn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
  topicTags?: string[]
  reasoning?: string | null
}

export type InterviewSessionPageQuestion = {
  id: string
  question: string
  difficulty: string
  category: string
  expectedConcepts: string[]
  answer: {
    rawAnswer: string
    overallScore: number | null
    technicalFeedback: { summary: string; strengths: string[]; improvements: string[] } | null
    weakConcepts: string[]
  } | null
}

export type InterviewSessionPageSession = Pick<
  InterviewSessionDetail,
  'id' | 'type' | 'mode' | 'status' | 'createdAt' | 'updatedAt' | 'version' | 'maxTurns' | 'lastActivityAt'
> & {
  companyMode?: { name: string } | null
  note?: { title: string | null } | null
  summary?: { headline: string } | null
  readinessImpact?: {
    overallDelta: number
    technicalDelta: number
    behavioralDelta: number
    systemDesignDelta: number
    communicationDelta: number
  } | null
  questions: InterviewSessionPageQuestion[]
}

export type InterviewSessionPageProps = {
  session?: InterviewSessionPageSession | null
  turns?: InterviewSessionPageTurn[]
  loading?: boolean
  error?: string
  reviewHref?: string
  renderMultiTurnForm?: (params: {
    sessionId: string
    turns: InterviewSessionPageTurn[]
    isComplete: boolean
  }) => React.ReactNode
  renderAnswerForm?: (params: { session: InterviewSessionPageSession }) => React.ReactNode
}
