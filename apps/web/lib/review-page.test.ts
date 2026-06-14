import assert from 'node:assert/strict'
import test from 'node:test'

import type { ReviewWeakConceptView } from '@interviewos/types'

import { normalizeReviewPageData } from './review-page'

const ACTIVE_STATUS = 'ACTIVE' as ReviewWeakConceptView['status']

test('normalizeReviewPageData fills missing arrays to prevent route crashes', () => {
  const result = normalizeReviewPageData(
    {
      title: 'Review',
      subtitle: 'Focus on what needs reinforcement next.',
      dueLabel: '2 due',
    },
    [],
  )

  assert.deepEqual(result.queue, [])
  assert.deepEqual(result.learningPath, [])
  assert.deepEqual(result.weakConcepts, [])
})

test('normalizeReviewPageData merges weak concept last seen timestamps from the live weak concept list', () => {
  const lastSeenAt = new Date('2026-06-14T10:30:00.000Z')

  const result = normalizeReviewPageData(
    {
      title: 'Review',
      subtitle: 'Focus on what needs reinforcement next.',
      dueLabel: '2 due',
      queue: [],
      learningPath: [],
      weakConcepts: [
        {
          id: 'concept-1',
          concept: 'Binary search',
          occurrenceCount: 3,
          masteryPercent: 42,
          status: ACTIVE_STATUS,
          lastSeenAt: null,
        },
      ],
    },
    [
      {
        id: 'concept-1',
        userId: 'user-1',
        concept: 'Binary search',
        occurrenceCount: 3,
        status: 'ACTIVE',
        lastSeenAt,
        sourceAnswerIds: [],
      },
    ],
  )

  assert.equal(result.weakConcepts[0]?.lastSeenAt, lastSeenAt)
})
