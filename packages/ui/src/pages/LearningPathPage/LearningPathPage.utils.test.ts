import assert from 'node:assert/strict'

import { type LearningPathItem, LearningPathItemStatus } from '@interviewos/types'
import { test } from 'vitest'

import { learningPathFixture } from './LearningPathPage.fixtures'
import {
  formatLearningPathLabel,
  getLearningPathEstimatedTimeLabel,
  getLearningPathFocusItem,
  getLearningPathProgress,
  getLearningPathStatusGroups,
  getLearningPathTypeSummaries,
} from './LearningPathPage.utils'

function createLearningPathItemWithMetadata(metadata: Record<string, number>): LearningPathItem {
  return {
    ...learningPathFixture.items[0],
    metadata,
  } as LearningPathItem & { metadata: Record<string, number> }
}

test('learning path helpers compute progress, focus item, and labels', () => {
  assert.equal(formatLearningPathLabel('TECHNICAL_NOTE'), 'Technical Note')
  assert.equal(getLearningPathProgress(learningPathFixture.items), 25)
  assert.equal(getLearningPathProgress([]), 0)
  assert.equal(getLearningPathFocusItem(learningPathFixture.items)?.id, 'learning-path-1')
})

test('getLearningPathStatusGroups omits empty status groups', () => {
  const groups = getLearningPathStatusGroups(learningPathFixture.items)

  assert.deepEqual(
    groups.map((group) => group.items.map((item) => item.status)),
    [
      [LearningPathItemStatus.PENDING, LearningPathItemStatus.IN_PROGRESS],
      [LearningPathItemStatus.COMPLETED],
      [LearningPathItemStatus.SNOOZED],
    ],
  )
})

test('getLearningPathTypeSummaries sorts by total then type', () => {
  assert.deepEqual(
    getLearningPathTypeSummaries(learningPathFixture.items).map((summary) => summary.type),
    ['ENGLISH_NOTE', 'PRACTICE_SET', 'QUESTION_SET', 'TECHNICAL_NOTE'],
  )
})

test('getLearningPathEstimatedTimeLabel reads supported metadata keys', () => {
  assert.equal(
    getLearningPathEstimatedTimeLabel(
      createLearningPathItemWithMetadata({ estimatedMinutes: 20 }),
    ),
    '20 min',
  )
  assert.equal(
    getLearningPathEstimatedTimeLabel(
      createLearningPathItemWithMetadata({ estimatedTimeMinutes: 15 }),
    ),
    '15 min',
  )
  assert.equal(getLearningPathEstimatedTimeLabel(learningPathFixture.items[0]), 'Flexible pacing')
})
