import assert from 'node:assert/strict'
import test from 'node:test'

import { RecommendationsService } from './recommendations.service'

test('RecommendationsService persists AI metadata on generated recommendations', async () => {
  let savedMetadata: Record<string, unknown> | undefined

  const service = new RecommendationsService(
    {
      getSourceContext: async () => ({
        notes: [],
        weakConcepts: [{ concept: 'Redis' }],
        englishWeaknesses: [],
      }),
      replaceRecommendations: async (
        _userId: string,
        items: Array<{ type: string; payload: Record<string, unknown> }>,
        aiMetadata?: Record<string, unknown>,
      ) => {
        savedMetadata = aiMetadata
        return items.map((item, index) => ({
          id: `rec-${index + 1}`,
          userId: 'user-1',
          status: 'PENDING',
          type: item.type,
          payload: item.payload,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      },
    } as never,
    {
      ensureUserById: async () => ({ id: 'user-1' }),
      findProfileByUserId: async () => ({
        currentLevel: 'MID',
        techStack: ['TypeScript'],
      }),
    } as never,
    {
      recommendNextLearning: async () => ({
        result: {
          recommendations: [
            {
              topic: 'Redis internals',
              reason: 'Weak concept trend',
              priority: 1,
              action: '/learning-path',
            },
          ],
        },
        metadata: {
          provider: 'mock',
          model: 'mock-model',
          promptKey: 'learning-recommendations.v1',
          promptVersion: 'v1',
          schemaKey: 'learning_recommendations',
          schemaVersion: 'v1',
          inputHash: 'hash-3',
          validationStatus: 'success',
          tokenUsage: { totalTokens: 15 },
          latencyMs: 2,
          generatedAt: new Date().toISOString(),
        },
      }),
    } as never,
    {
      getReviewQueue: async () => ({ items: [], dueCount: 0 }),
    } as never,
  )

  await service.getRecommendations({
    id: 'user-1',
    email: 'user-1@example.com',
    name: 'User One',
    emailVerifiedAt: new Date(),
    sessionId: 'session-1',
  })

  assert.equal(savedMetadata?.promptKey, 'learning-recommendations.v1')
})
