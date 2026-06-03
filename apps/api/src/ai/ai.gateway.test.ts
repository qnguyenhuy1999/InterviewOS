import assert from 'node:assert/strict'
import test from 'node:test'

import { AIResponseValidationError } from '@interviewos/ai'

import { AIGateway } from './ai.gateway'

const metadata = {
  provider: 'mock',
  model: 'mock-model',
  promptKey: 'technical-note.v1',
  promptVersion: 'v1',
  schemaKey: 'technical_note',
  schemaVersion: 'v1',
  inputHash: 'hash',
  validationStatus: 'success' as const,
  tokenUsage: { totalTokens: 12 },
  latencyMs: 4,
  generatedAt: new Date().toISOString(),
}

test('AIGateway writes AIRequestLog entries for successful requests', async () => {
  const logs: Array<Record<string, unknown>> = []
  const gateway = new AIGateway(
    {
      generateTechnicalNote: async () => ({
        result: {
          title: 'Redis',
          content: {
            purpose: 'purpose',
            quickReference: ['ref'],
            coreConcepts: ['concept'],
            mentalModel: 'model',
            productionUsage: ['usage'],
            practicalExamples: ['example'],
            commonPitfalls: ['pitfall'],
            debuggingChecklist: ['debug'],
            productionChecklist: ['prod'],
            seniorInterviewSignals: ['signal'],
          },
          sections: [{ heading: 'Purpose', content: 'content' }],
        },
        metadata,
      }),
    } as never,
    {
      createRequestLog: async (payload: Record<string, unknown>) => {
        logs.push(payload)
      },
    } as never,
  )

  const result = await gateway.generateTechnicalNote(
    {
      topic: 'Redis',
      noteType: 'CONCEPT',
      targetLevel: 'SENIOR',
      targetRole: 'Backend Engineer',
      englishLevel: 'INTERMEDIATE',
    } as never,
    { userId: 'user-1' },
  )

  assert.equal(result.metadata.promptKey, 'technical-note.v1')
  assert.equal(logs[0]?.operation, 'generateTechnicalNote')
  assert.equal(logs[0]?.userId, 'user-1')
})

test('AIGateway writes AIRequestLog entries for validation failures', async () => {
  const logs: Array<Record<string, unknown>> = []
  const gateway = new AIGateway(
    {
      generateTechnicalNote: async () => {
        throw new AIResponseValidationError('validation failed', {
          ...metadata,
          validationStatus: 'validation_failed',
        })
      },
    } as never,
    {
      createRequestLog: async (payload: Record<string, unknown>) => {
        logs.push(payload)
      },
    } as never,
  )

  await assert.rejects(
    () =>
      gateway.generateTechnicalNote(
        {
          topic: 'Redis',
          noteType: 'CONCEPT',
          targetLevel: 'SENIOR',
          targetRole: 'Backend Engineer',
          englishLevel: 'INTERMEDIATE',
        } as never,
        { userId: 'user-1' },
      ),
    AIResponseValidationError,
  )

  assert.equal(logs[0]?.operation, 'generateTechnicalNote')
  assert.equal((logs[0]?.metadata as { validationStatus?: string }).validationStatus, 'validation_failed')
})
