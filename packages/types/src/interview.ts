import type { InterviewType, QuestionDifficulty } from './enums'

export interface InterviewSession {
  id: string
  userId: string
  interviewType: InterviewType
  startedAt: Date
  endedAt: Date | null
}

export interface InterviewQuestion {
  id: string
  sessionId: string
  question: string
  difficulty: QuestionDifficulty
  order: number
}

export interface InterviewAnswer {
  id: string
  questionId: string
  transcript: string
  score: number | null
  feedback: string | null
  evaluatedAt: Date | null
}
