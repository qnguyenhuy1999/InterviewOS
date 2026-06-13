import assert from 'node:assert/strict'
import test from 'node:test'

import { EvaluationService } from './evaluation.service'

const gatewayResult = {
  result: {
    overallScore: 82,
    confidence: undefined,
    dimensionScores: {
      correctness: 8,
      depth: 7,
      problemSolving: 8,
      clarity: 9,
      structure: 8,
      confidence: 7,
    },
    strengths: ['Structured answer'],
    improvements: ['Quantify tradeoffs'],
    coachingNotes: ['Lead with recommendation'],
    weakConcepts: ['Tradeoff analysis'],
  },
  metadata: { provider: 'mock', promptKey: 'session-evaluation.v1' },
}

test('EvaluationService triggerEvaluation marks sessions complete with derived evidence and rubric scores', async () => {
  let completedPayload: Record<string, unknown> | undefined
  const service = new EvaluationService(
    {
      findSessionWithTurns: async () => ({
        id: 'session-1',
        type: 'TECHNICAL',
        overrideLevel: null,
        overrideRole: null,
        turns: [
          { role: 'INTERVIEWER', content: 'Explain cache invalidation.' },
          { role: 'CANDIDATE', content: 'I would use TTLs and explicit invalidation.' },
          { role: 'INTERVIEWER', content: 'What can go wrong?' },
          { role: 'CANDIDATE', content: 'Stale data and stampedes are common risks.' },
        ],
      }),
      createPending: async () => undefined,
      findUserProfile: async () => ({ targetLevel: 'SENIOR', targetRole: 'Backend Engineer' }),
      markComplete: async (_sessionId: string, payload: Record<string, unknown>) => {
        completedPayload = payload
      },
      markFailed: async () => undefined,
    } as never,
    {
      generateSessionEvaluation: async () => gatewayResult,
    } as never,
  )

  await service.triggerEvaluation('session-1', 'user-1')

  assert.equal(completedPayload?.overallScore, 82)
  assert.equal(completedPayload?.summary, 'Structured answer Quantify tradeoffs')
  assert.equal(completedPayload?.confidence, 65)
  assert.equal((completedPayload?.evidence as Array<unknown>).length, 2)
  assert.deepEqual(
    (completedPayload?.rubricScores as Array<{ key: string; score: number }>).map((item) => [
      item.key,
      item.score,
    ]),
    [
      ['correctness', 80],
      ['depth', 70],
      ['communication', 90],
      ['problem-solving', 80],
    ],
  )
  assert.equal((completedPayload?.weaknesses as Array<{ severity: string }>)[0].severity, 'HIGH')
  assert.equal((completedPayload?.recommendations as Array<{ priority: string }>)[0].priority, 'NOW')
})

test('EvaluationService triggerEvaluation marks failed when the gateway throws', async () => {
  let failedSessionId: string | undefined
  const service = new EvaluationService(
    {
      findSessionWithTurns: async () => ({
        id: 'session-1',
        type: 'TECHNICAL',
        overrideLevel: null,
        overrideRole: null,
        turns: [{ role: 'INTERVIEWER', content: 'Explain caching.' }],
      }),
      createPending: async () => undefined,
      findUserProfile: async () => null,
      markComplete: async () => undefined,
      markFailed: async (sessionId: string) => {
        failedSessionId = sessionId
      },
    } as never,
    {
      generateSessionEvaluation: async () => {
        throw new Error('provider down')
      },
    } as never,
  )

  await service.triggerEvaluation('session-1', 'user-1')

  assert.equal(failedSessionId, 'session-1')
})
