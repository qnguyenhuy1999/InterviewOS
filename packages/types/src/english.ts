import type { EnglishLevel } from './enums'

export interface EnglishNote {
  id: string
  userId: string
  content: string
  targetLevel: EnglishLevel
  overallScore: number | null
  feedback: string | null
  grammarIssues: Array<{ original: string; suggestion: string; explanation: string }>
  vocabularyNotes: string[]
  createdAt: Date
}
