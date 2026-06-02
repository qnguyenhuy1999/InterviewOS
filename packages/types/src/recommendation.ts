import type { RecommendationStatus } from './enums'

export interface LearningRecommendation {
  id: string
  userId: string
  topic: string
  reason: string
  priority: number
  status: RecommendationStatus
  createdAt: Date
  updatedAt: Date
}

export interface UserWeakConcept {
  id: string
  userId: string
  concept: string
  occurrenceCount: number
  lastSeenAt: Date
}

export interface UserEnglishWeakness {
  id: string
  userId: string
  category: string
  description: string
  occurrenceCount: number
}
