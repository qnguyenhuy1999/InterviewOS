import assert from 'node:assert/strict'
import test from 'node:test'

import { ReviewRating } from '@interviewos/types'
import { NotFoundException } from '@nestjs/common'

import { ReviewService } from './review.service'

const now = new Date()

function createReviewItem(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'review-1',
    userId: 'user-1',
    type: 'TECHNICAL_NOTE',
    sourceId: 'note-1',
    sourceLabel: 'Redis cache invalidation',
    weaknessScore: 40,
    masteryScore: 60,
    nextReviewAt: new Date(now.getTime() - 60_000),
    reviewIntervalDays: 2,
    lastReviewedAt: null,
    lastFailureAt: null,
    lastRating: null,
    metadata: { noteId: 'note-1' },
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

test('ReviewService ranks due and role-relevant review queue items', async () => {
  const service = new ReviewService(
    {
      listReviewItems: async () => [
        createReviewItem({ id: 'low', sourceLabel: 'Generic question', nextReviewAt: new Date(now.getTime() + 86_400_000) }),
        createReviewItem({ id: 'high', sourceLabel: 'Redis architecture', lastFailureAt: now }),
      ],
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
      findProfileByUserId: async () => ({ targetRole: 'Backend Engineer', techStack: ['Redis'] }),
    } as never,
  )

  const queue = await service.getReviewQueue({ id: 'user-1' })

  assert.equal(queue.items[0].item.id, 'high')
  assert.equal(queue.items[0].reasons.includes('overdue'), true)
  assert.equal(queue.items[0].reasons.includes('recent failure'), true)
  assert.equal(queue.items[0].reasons.includes('role relevant'), true)
  assert.equal(queue.dueCount, 1)
})

test('ReviewService rateReviewItem schedules GOOD ratings with higher mastery and longer intervals', async () => {
  let updatePayload: Record<string, unknown> | undefined
  const service = new ReviewService(
    {
      findReviewItem: async () => createReviewItem(),
      createAttemptAndUpdateItem: async (payload: Record<string, unknown>) => {
        updatePayload = payload
        return payload
      },
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
    } as never,
  )

  await service.rateReviewItem({ id: 'user-1' }, 'review-1', { rating: ReviewRating.GOOD })

  assert.equal(updatePayload?.masteryBefore, 60)
  assert.equal(updatePayload?.masteryAfter, 72)
  assert.equal(updatePayload?.reviewIntervalDays, 4)
  assert.equal(updatePayload?.weaknessScore, 15)
  assert.equal(updatePayload?.lastFailureAt, null)
})

test('ReviewService rateReviewItem throws for missing items', async () => {
  const service = new ReviewService(
    {
      findReviewItem: async () => null,
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
    } as never,
  )

  await assert.rejects(
    service.rateReviewItem({ id: 'user-1' }, 'missing', { rating: ReviewRating.GOOD }),
    NotFoundException,
  )
})

test('ReviewService builds learning path actions from the top six queue entries', async () => {
  let learningItems: Array<Record<string, unknown>> | undefined
  const service = new ReviewService(
    {
      listReviewItems: async () => [
        createReviewItem({ id: 'note-review', type: 'TECHNICAL_NOTE', sourceId: 'note-1', sourceLabel: 'Note' }),
        createReviewItem({
          id: 'question-review',
          type: 'GENERATED_QUESTION',
          sourceId: 'question-1',
          sourceLabel: 'Question',
          metadata: { noteId: 'note-2' },
        }),
        createReviewItem({ id: 'english-review', type: 'ENGLISH_NOTE', sourceId: 'english-1', sourceLabel: 'English' }),
        createReviewItem({ id: 'weak-review', type: 'WEAK_CONCEPT', sourceId: 'weak-1', sourceLabel: 'Weak' }),
      ],
      replacePendingLearningPath: async (_userId: string, items: Array<Record<string, unknown>>) => {
        learningItems = items
        return items
      },
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
      findProfileByUserId: async () => null,
    } as never,
  )

  await service.buildLearningPath({ id: 'user-1' })

  assert.deepEqual(
    learningItems?.map((item) => item.actionPath),
    ['/notebook/note-1', '/notebook/note-2', '/english-notes', '/review'],
  )
})
