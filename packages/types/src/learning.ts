import type {
  EnglishLevel,
  ExperienceLevel,
  LearningPathItemStatus,
  ReviewItemType,
  ReviewRating,
  WeakConceptStatus,
} from './enums'

export interface LearningStateInput {
  targetLevel: ExperienceLevel
  englishLevel: EnglishLevel
  techStack: string[]
  targetRole?: string
  interviewGoals: string[]
  activeWeakConcepts: string[]
  weakConceptCount: number
}

export interface ReviewItem {
  id: string
  userId: string
  type: ReviewItemType
  sourceId: string
  sourceLabel: string
  weaknessScore: number
  masteryScore: number
  nextReviewAt: Date
  reviewIntervalDays: number
  lastReviewedAt: Date | null
  lastFailureAt: Date | null
  lastRating: ReviewRating | null
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
  status: LearningPathItemStatus
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
    status: WeakConceptStatus
  }>
}

export interface DashboardMetricView {
  label: string
  value: string
  hint: string
}

export interface DashboardStudyProgressView {
  title: string
  description: string
  topic: string
  progressLabel: string
  progressValue: number
  ctaLabel: string
}

export interface DashboardQuickActionView {
  label: string
}

export interface DashboardNoteSummaryView {
  id: string
  title: string
  domain: string
  updatedLabel: string
  difficulty: 'Hard' | 'Medium' | 'Low'
}

export interface DashboardWeakConceptView {
  id: string
  title: string
  subtitle: string
  severity: 'High' | 'Medium' | 'Low'
}

export interface DashboardInterviewSessionView {
  id: string
  score: number
  title: string
  meta: string
  techScore: number
  englishScore: number
}

export interface DashboardEnglishImprovementView {
  id: string
  title: string
  subtitle: string
}

export interface DashboardPageView {
  greeting: string
  subtitle: string
  reviewQueueLabel: string
  metrics: DashboardMetricView[]
  studyProgress: DashboardStudyProgressView
  quickActions: DashboardQuickActionView[]
  notes: DashboardNoteSummaryView[]
  weakConcepts: DashboardWeakConceptView[]
  sessions: DashboardInterviewSessionView[]
  englishImprovements: DashboardEnglishImprovementView[]
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

export interface ReviewQueueCardView {
  id: string
  reviewItemId: string
  title: string
  type: ReviewItemType
  masteryPercent: number
  weaknessScore: number
  nextReviewLabel: string
  lastRating: ReviewRating | null
  availableRatings: ReviewRating[]
}

export interface ReviewLearningPathView {
  id: string
  title: string
  detail: string
  typeLabel: string
  priorityScore: number
  status: LearningPathItemStatus
}

export interface ReviewWeakConceptView {
  id: string
  concept: string
  occurrenceCount: number
  masteryPercent: number
  status: WeakConceptStatus
  lastSeenAt?: Date | string | null
}

export interface ReviewPageView {
  title: string
  subtitle: string
  dueLabel: string
  queue: ReviewQueueCardView[]
  learningPath: ReviewLearningPathView[]
  weakConcepts: ReviewWeakConceptView[]
}
