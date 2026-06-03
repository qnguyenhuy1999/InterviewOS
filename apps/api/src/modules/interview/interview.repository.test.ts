import assert from 'node:assert/strict'
import test from 'node:test'

import { InterviewRepository } from './interview.repository'

test('InterviewRepository deduplicates source answer ids while aggregating weaknesses', async () => {
  const weakConceptUpdateCalls: Array<Record<string, unknown>> = []
  const englishWeaknessUpdateCalls: Array<Record<string, unknown>> = []

  const repository = new InterviewRepository({
    userWeakConcept: {
      findFirst: async ({ where }: { where: { concept?: string } }) =>
        where.concept === 'TTL'
          ? {
              id: 'weak-1',
              occurrenceCount: 2,
              sourceAnswerIds: ['answer-1'],
            }
          : null,
      create: async () => undefined,
      update: async ({ data }: { data: Record<string, unknown> }) => {
        weakConceptUpdateCalls.push(data)
      },
    },
    userEnglishWeakness: {
      findFirst: async ({ where }: { where: { topic?: string } }) =>
        where.topic === 'sentence clarity'
          ? {
              id: 'eng-1',
              occurrenceCount: 1,
              sourceAnswerIds: ['answer-1'],
            }
          : null,
      create: async () => undefined,
      update: async ({ data }: { data: Record<string, unknown> }) => {
        englishWeaknessUpdateCalls.push(data)
      },
    },
  } as never)

  await repository.upsertWeakConcepts('user-1', 'answer-1', ['TTL'])
  await repository.upsertEnglishWeaknesses('user-1', 'answer-2', ['sentence clarity'])

  assert.deepEqual(weakConceptUpdateCalls[0]?.sourceAnswerIds, ['answer-1'])
  assert.equal(weakConceptUpdateCalls[0]?.occurrenceCount, 3)
  assert.deepEqual(englishWeaknessUpdateCalls[0]?.sourceAnswerIds, ['answer-1', 'answer-2'])
  assert.equal(englishWeaknessUpdateCalls[0]?.occurrenceCount, 2)
})
