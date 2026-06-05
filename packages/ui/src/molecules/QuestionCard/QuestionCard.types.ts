import type { QuestionDifficulty as QuestionDifficultyType } from '../../fixtures'

export type Question = {
  id: string
  sessionId: string
  question: string
  difficulty: QuestionDifficultyType
  order: number
}

export type Answer = {
  id: string
  questionId: string
  transcript: string
  score: number | null
  feedback: string | null
  evaluatedAt: Date | null
}

export type QuestionCardProps = {
  question: Question
  answer?: Answer
  loading?: boolean
}
