import {
  LearningPathItemStatus,
  ReviewItemType,
  ReviewRating,
  WeakConceptStatus,
} from '@interviewos/types'

export const REVIEW_ITEM_TYPE_LABEL: Record<ReviewItemType, string> = {
  [ReviewItemType.TECHNICAL_NOTE]: 'Note',
  [ReviewItemType.GENERATED_QUESTION]: 'Question',
  [ReviewItemType.ENGLISH_NOTE]: 'English',
  [ReviewItemType.WEAK_CONCEPT]: 'Concept',
}

export const REVIEW_RATING_TONE: Record<ReviewRating, string> = {
  [ReviewRating.AGAIN]: 'border-destructive/30 bg-destructive/10 text-destructive',
  [ReviewRating.HARD]: 'border-warning/30 bg-warning-soft text-warning',
  [ReviewRating.GOOD]: 'border-primary/20 bg-primary/10 text-primary',
  [ReviewRating.EASY]: 'border-success/30 bg-success-soft text-success',
}

export const REVIEW_STATUS_TONE: Record<WeakConceptStatus, string> = {
  [WeakConceptStatus.ACTIVE]: 'border-destructive/30 bg-destructive/10 text-destructive',
  [WeakConceptStatus.IMPROVING]: 'border-warning/30 bg-warning-soft text-warning',
  [WeakConceptStatus.RESOLVED]: 'border-success/30 bg-success-soft text-success',
  [WeakConceptStatus.IGNORED]: 'border-border bg-muted text-muted-foreground',
}

export const LEARNING_PATH_STATUS_BUTTON_VARIANT: Record<
  LearningPathItemStatus,
  'default' | 'outline' | 'secondary'
> = {
  [LearningPathItemStatus.PENDING]: 'default',
  [LearningPathItemStatus.IN_PROGRESS]: 'secondary',
  [LearningPathItemStatus.COMPLETED]: 'outline',
  [LearningPathItemStatus.SNOOZED]: 'outline',
  [LearningPathItemStatus.SKIPPED]: 'outline',
}
