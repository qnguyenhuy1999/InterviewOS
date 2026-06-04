import type { ExperienceLevel, InterviewType, TurnDecision, TurnRole } from './enums'

export interface InterviewTurn {
  id: string
  sessionId: string
  turnNumber: number
  role: TurnRole
  content: string
  decision: TurnDecision | null
  topicTags: string[]
  reasoning?: string | null
  references?: Array<{ label: string; value: string }> | null
  evaluation?: {
    strengths?: string[]
    risks?: string[]
    confidence?: number | null
  } | null
  createdAt: Date
}

export interface TurnResponseDto {
  candidateTurn: InterviewTurn
  interviewerTurn: InterviewTurn | null
  decision: TurnDecision
  turnNumber: number
  isComplete: boolean
}

export interface StartMultiTurnSessionInput {
  type: InterviewType
  companyModeSlug?: string
  noteId?: string
  overrideRole?: string
  overrideLevel?: ExperienceLevel
  overrideStack?: string[]
  maxTurns?: number
}

export interface SubmitTurnInput {
  answer: string
}
