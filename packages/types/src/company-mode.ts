import type { QuestionDifficulty } from './enums'

export interface DifficultyProfile {
  startingDifficulty: QuestionDifficulty
  escalationRate: 'SLOW' | 'MEDIUM' | 'FAST'
  maxDifficulty: QuestionDifficulty
}

export interface FollowUpBehavior {
  maxFollowUpsPerQuestion: number
  challengeThreshold: number
  clarificationThreshold: number
}

export interface CompanyModeConfig {
  interviewerPersona: string
  difficultyProfile: DifficultyProfile
  followUpBehavior: FollowUpBehavior
  evaluationCriteria: { weights: Partial<Record<string, number>>; rubric: string }
  feedbackStyle: 'DIRECT' | 'COACHING' | 'SOCRATIC'
  questionBank?: string[]
}

export interface CompanyMode {
  id: string
  slug: string
  name: string
  config: CompanyModeConfig
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
