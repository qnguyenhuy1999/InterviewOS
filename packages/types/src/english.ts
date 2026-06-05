import type { EnglishNoteStatus } from './enums'

export interface EnglishNote {
  id: string
  userId: string
  answerId: string
  originalSentence: string
  correctedSentence: string
  naturalVersion: string
  explanation: string
  grammarTopic: string
  recommendedStudyTopics: string[]
  practicePatterns: string[]
  status: EnglishNoteStatus
  createdAt: Date
  updatedAt: Date
}
