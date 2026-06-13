import assert from 'node:assert/strict'
import test from 'node:test'

import { ReadinessService } from './readiness.service'

test('ReadinessService paginates history metadata', async () => {
  const service = new ReadinessService({
    findHistory: async () => ({ items: [{ id: 'snapshot-1' }], total: 11 }),
  } as never)

  assert.deepEqual(await service.findHistory('user-1', { page: 2, limit: 5 }), {
    items: [{ id: 'snapshot-1' }],
    meta: { page: 2, limit: 5, total: 11, totalPages: 3 },
  })
})

test('ReadinessService computes weighted readiness dimensions and improvement trend', async () => {
  let savedPayload: Record<string, unknown> | undefined
  const service = new ReadinessService({
    getComputationContext: async () => ({
      sessions: [
        {
          type: 'TECHNICAL',
          evaluation: {
            overallScore: 80,
            dimensionScores: { clarity: 8, confidence: 6 },
          },
        },
        {
          type: 'BEHAVIORAL',
          evaluation: {
            overallScore: 60,
            dimensionScores: { clarity: 6, confidence: 6 },
          },
        },
        {
          type: 'SYSTEM_DESIGN',
          evaluation: {
            overallScore: 90,
            dimensionScores: { clarity: 9, confidence: 7 },
          },
        },
      ],
      reviewItems: [{ masteryScore: 0.8 }, { masteryScore: 0.4 }],
      learningItems: [{ status: 'COMPLETED' }, { status: 'PENDING' }],
    }),
    findLastSnapshot: async () => ({ overallScore: 60 }),
    saveSnapshot: async (_userId: string, payload: Record<string, unknown>) => {
      savedPayload = payload
      return { id: 'snapshot-1', ...payload }
    },
  } as never)

  const snapshot = await service.computeAndSave('user-1')

  assert.equal(snapshot.overallScore, 68)
  assert.equal(savedPayload?.confidenceLevel, 0.3)
  assert.equal(savedPayload?.improvementTrend, 8)
  assert.equal(savedPayload?.technicalMastery, 0.6)
  assert.equal(savedPayload?.learningProgress, 0.5)
  assert.deepEqual(
    (savedPayload?.breakdown as Array<{ dimension: string; trend: string }>).map((item) => [
      item.dimension,
      item.trend,
    ]),
    [
      ['technicalMastery', 'UP'],
      ['interviewPerformance', 'UP'],
      ['behavioralPerformance', 'UP'],
      ['systemDesignPerformance', 'UP'],
      ['englishCommunication', 'UP'],
      ['reviewCompletion', 'UP'],
      ['learningProgress', 'UP'],
    ],
  )
})
