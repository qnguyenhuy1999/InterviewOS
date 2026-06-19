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
        createReviewItem({
          id: 'low',
          sourceLabel: 'Generic question',
          nextReviewAt: new Date(now.getTime() + 86_400_000),
        }),
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
        createReviewItem({
          id: 'note-review',
          type: 'TECHNICAL_NOTE',
          sourceId: 'note-1',
          sourceLabel: 'Note',
        }),
        createReviewItem({
          id: 'question-review',
          type: 'GENERATED_QUESTION',
          sourceId: 'question-1',
          sourceLabel: 'Question',
          metadata: { noteId: 'note-2' },
        }),
        createReviewItem({
          id: 'english-review',
          type: 'ENGLISH_NOTE',
          sourceId: 'english-1',
          sourceLabel: 'English',
        }),
        createReviewItem({
          id: 'weak-review',
          type: 'WEAK_CONCEPT',
          sourceId: 'weak-1',
          sourceLabel: 'Weak',
        }),
      ],
      replacePendingLearningPath: async (
        _userId: string,
        items: Array<Record<string, unknown>>,
      ) => {
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

test('ReviewService deduplicates learning path entries that point to the same notebook', async () => {
  let learningItems: Array<Record<string, unknown>> | undefined
  const service = new ReviewService(
    {
      listReviewItems: async () => [
        createReviewItem({
          id: 'note-review',
          type: 'TECHNICAL_NOTE',
          sourceId: 'note-1',
          sourceLabel: 'Primary note',
          weaknessScore: 95,
          masteryScore: 10,
        }),
        createReviewItem({
          id: 'question-review-1',
          type: 'GENERATED_QUESTION',
          sourceId: 'question-1',
          sourceLabel: 'Question tied to same note',
          weaknessScore: 90,
          masteryScore: 10,
          metadata: { noteId: 'note-1' },
        }),
        createReviewItem({
          id: 'question-review-2',
          type: 'GENERATED_QUESTION',
          sourceId: 'question-2',
          sourceLabel: 'Question tied to another note',
          weaknessScore: 85,
          masteryScore: 20,
          metadata: { noteId: 'note-2' },
        }),
      ],
      replacePendingLearningPath: async (
        _userId: string,
        items: Array<Record<string, unknown>>,
      ) => {
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
    ['/notebook/note-1', '/notebook/note-2'],
  )
})

test('ReviewService merges review signals that point to the same notebook target', async () => {
  let learningItems: Array<Record<string, unknown>> | undefined
  const service = new ReviewService(
    {
      listReviewItems: async () => [
        createReviewItem({
          id: 'note-review',
          type: 'TECHNICAL_NOTE',
          sourceId: 'note-1',
          sourceLabel: 'Primary note title',
          weaknessScore: 95,
          masteryScore: 10,
        }),
        createReviewItem({
          id: 'question-review',
          type: 'GENERATED_QUESTION',
          sourceId: 'question-1',
          sourceLabel: 'Question for same note',
          weaknessScore: 90,
          masteryScore: 20,
          metadata: { noteId: 'note-1' },
          lastFailureAt: now,
        }),
      ],
      replacePendingLearningPath: async (
        _userId: string,
        items: Array<Record<string, unknown>>,
      ) => {
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

  assert.equal(learningItems?.length, 1)
  assert.equal(learningItems?.[0]?.actionPath, '/notebook/note-1')
  assert.equal(learningItems?.[0]?.title, 'Question for same note')
  assert.equal(learningItems?.[0]?.sourceReviewItemId, 'question-review')
  assert.deepEqual(learningItems?.[0]?.metadata, {
    reviewType: 'GENERATED_QUESTION',
    targetType: 'NOTEBOOK_NOTE',
    targetId: 'note-1',
    sourceReviewItemIds: ['question-review', 'note-review'],
    reviewTypes: ['GENERATED_QUESTION', 'TECHNICAL_NOTE'],
  })
  assert.equal(learningItems?.[0]?.reason, 'overdue, recent failure')
})

test('ReviewService keeps generated questions without noteId as standalone fallback targets', async () => {
  let learningItems: Array<Record<string, unknown>> | undefined
  const service = new ReviewService(
    {
      listReviewItems: async () => [
        createReviewItem({
          id: 'question-review',
          type: 'GENERATED_QUESTION',
          sourceId: 'question-1',
          sourceLabel: 'Standalone interview question',
          metadata: {},
        }),
      ],
      replacePendingLearningPath: async (
        _userId: string,
        items: Array<Record<string, unknown>>,
      ) => {
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

  assert.deepEqual(learningItems, [
    {
      type: 'GENERATED_QUESTION',
      title: 'Standalone interview question',
      reason: 'overdue',
      actionPath: '/interview',
      priorityScore: 230,
      sourceReviewItemId: 'question-review',
      metadata: {
        reviewType: 'GENERATED_QUESTION',
        targetType: 'GENERATED_QUESTION',
        targetId: 'question-1',
        sourceReviewItemIds: ['question-review'],
        reviewTypes: ['GENERATED_QUESTION'],
      },
    },
  ])
})
