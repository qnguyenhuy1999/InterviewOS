import { LearningPathItemStatus, ReviewRating, WeakConceptStatus } from '@interviewos/types'

import { cn } from '../../../lib/utils'
import {
  LEARNING_PATH_STATUS_BUTTON_VARIANT,
  REVIEW_RATING_TONE,
  REVIEW_STATUS_TONE,
} from './ReviewPage.constants'

export function getReviewRatingClassName(rating: ReviewRating) {
  return cn(
    'inline-flex min-w-16 items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium uppercase tracking-widest',
    REVIEW_RATING_TONE[rating],
  )
}

export function getWeakConceptStatusClassName(status: WeakConceptStatus) {
  return cn(
    'inline-flex min-w-20 items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium uppercase tracking-widest',
    REVIEW_STATUS_TONE[status],
  )
}

export function getLearningPathActionLabel(status: LearningPathItemStatus) {
  switch (status) {
    case LearningPathItemStatus.IN_PROGRESS:
      return 'Resume'
    case LearningPathItemStatus.COMPLETED:
      return 'Review'
    case LearningPathItemStatus.SNOOZED:
      return 'Unsnooze'
    case LearningPathItemStatus.SKIPPED:
      return 'Retry'
    case LearningPathItemStatus.PENDING:
    default:
      return 'Start'
  }
}

export function getLearningPathActionVariant(status: LearningPathItemStatus) {
  return LEARNING_PATH_STATUS_BUTTON_VARIANT[status]
}

export function getWeakConceptActions(status: WeakConceptStatus) {
  switch (status) {
    case WeakConceptStatus.RESOLVED:
      return ['ignore'] as const
    case WeakConceptStatus.IGNORED:
      return ['resolve'] as const
    case WeakConceptStatus.ACTIVE:
    case WeakConceptStatus.IMPROVING:
    default:
      return ['resolve', 'ignore'] as const
  }
}

export function getReviewRatingLabel(rating: ReviewRating | null) {
  return rating ?? ReviewRating.GOOD
}
