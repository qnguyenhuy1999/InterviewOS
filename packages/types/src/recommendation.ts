import type { RecommendationStatus } from './enums'

export interface LearningRecommendation {
  id: string
  userId: string
  type: string
  payload: RecommendationPayload
  status: RecommendationStatus
  createdAt: Date
  updatedAt: Date
}

export interface RecommendationPayload {
  title: string
  reason: string
  action: string
  metadata?: Record<string, string | number | boolean | null>
}

export interface UserWeakConcept {
  id: string
  userId: string
  concept: string
  occurrenceCount: number
  lastSeenAt: Date
  sourceAnswerIds: string[]
}

export interface UserEnglishWeakness {
  id: string
  userId: string
  topic: string
  occurrenceCount: number
  lastSeenAt: Date
  sourceAnswerIds: string[]
}

export interface RecommendationSummary {
  nextNoteToReview: RecommendationPayload | null
  nextQuestionToPractice: RecommendationPayload | null
  nextEnglishTopic: RecommendationPayload | null
  nextLearningItem: RecommendationPayload | null
  persisted: LearningRecommendation[]
}
