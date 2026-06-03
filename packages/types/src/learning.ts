export interface ReviewItem {
  id: string
  userId: string
  type: string
  sourceId: string
  sourceLabel: string
  weaknessScore: number
  masteryScore: number
  nextReviewAt: Date
  reviewIntervalDays: number
  lastReviewedAt: Date | null
  lastFailureAt: Date | null
  lastRating: string | null
  metadata?: unknown
  createdAt: Date
  updatedAt: Date
}

export interface ReviewAttempt {
  id: string
  reviewItemId: string
  userId: string
  rating: string
  masteryBefore: number
  masteryAfter: number
  reviewIntervalDays: number
  nextReviewAt: Date
  createdAt: Date
}

export interface ReviewQueueItem {
  item: ReviewItem
  priorityScore: number
  reasons: string[]
}

export interface ReviewQueueResponse {
  items: ReviewQueueItem[]
  dueCount: number
}

export interface LearningPathItem {
  id: string
  userId: string
  type: string
  title: string
  reason: string
  actionPath: string
  status: string
  priorityScore: number
  availableAt: Date
  snoozedUntil: Date | null
  startedAt: Date | null
  completedAt: Date | null
  skippedAt: Date | null
  sourceReviewItemId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface DashboardProgress {
  interviewReadiness: number
  technicalMastery: number
  englishScore: number
  reviewStreak: number
  questionsPracticed: number
  notesMastered: number
  dueReviews: number
  weakConceptTrends: Array<{
    concept: string
    occurrenceCount: number
    status: string
  }>
}

export interface EnglishNoteStatusUpdateInput {
  status: string
}

export interface WeakConceptStatusUpdateInput {
  status: string
}

export interface ReviewRatingInput {
  rating: string
}

export interface LearningPathActionInput {
  action: 'start' | 'complete' | 'snooze' | 'skip'
}
