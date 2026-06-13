import assert from 'node:assert/strict'

import { LearningPathItemStatus, ReviewRating, WeakConceptStatus } from '@interviewos/types'
import { test } from 'vitest'

import {
  getLearningPathActionLabel,
  getReviewRatingLabel,
  getWeakConceptActions,
} from './ReviewPage.utils'

test('review utility labels map learning statuses to the next action', () => {
  assert.equal(getLearningPathActionLabel(LearningPathItemStatus.PENDING), 'Start')
  assert.equal(getLearningPathActionLabel(LearningPathItemStatus.IN_PROGRESS), 'Resume')
  assert.equal(getLearningPathActionLabel(LearningPathItemStatus.COMPLETED), 'Review')
  assert.equal(getLearningPathActionLabel(LearningPathItemStatus.SNOOZED), 'Unsnooze')
  assert.equal(getLearningPathActionLabel(LearningPathItemStatus.SKIPPED), 'Retry')
})

test('weak concept actions reflect terminal and active states', () => {
  assert.deepEqual(getWeakConceptActions(WeakConceptStatus.ACTIVE), ['resolve', 'ignore'])
  assert.deepEqual(getWeakConceptActions(WeakConceptStatus.IMPROVING), ['resolve', 'ignore'])
  assert.deepEqual(getWeakConceptActions(WeakConceptStatus.RESOLVED), ['ignore'])
  assert.deepEqual(getWeakConceptActions(WeakConceptStatus.IGNORED), ['resolve'])
})

test('getReviewRatingLabel defaults unrated items to GOOD', () => {
  assert.equal(getReviewRatingLabel(null), ReviewRating.GOOD)
  assert.equal(getReviewRatingLabel(ReviewRating.AGAIN), ReviewRating.AGAIN)
})
