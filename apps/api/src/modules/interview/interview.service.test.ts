import assert from 'node:assert/strict'
import test from 'node:test'

import { InterviewService } from './interview.service'

test('InterviewService lets session overrides replace saved defaults', async () => {
  let capturedTechnicalLevel: string | undefined
  let capturedEnglishLevel: string | undefined
  let savedPayload: Record<string, unknown> | undefined
  let englishMetadata: Record<string, unknown> | undefined

  const service = new InterviewService(
    {
      findSessionById: async () => ({
        id: 'session-1',
        overrideRole: null,
        overrideLevel: null,
        overrideStack: [],
        overrideGoals: [],
        overrideEnglishLevel: null,
        preferredOutputStyle: null,
        questions: [
          {
            id: 'question-1',
            question: 'Explain Redis cache invalidation.',
            expectedConcepts: ['TTL', 'invalidation'],
            sourceSection: 'Core Concepts',
          },
        ],
      }),
      saveAnswer: async (_sessionId: string, _questionId: string, payload: Record<string, unknown>) => {
        savedPayload = payload
        return {
          questions: [{ answer: { id: 'answer-1' } }],
        }
      },
      saveEnglishNotes: async (
        _userId: string,
        _answerId: string,
        _notes: unknown[],
        metadata: Record<string, unknown>,
      ) => {
        englishMetadata = metadata
        return []
      },
      upsertWeakConcepts: async () => undefined,
      upsertEnglishWeaknesses: async () => undefined,
    } as never,
    {} as never,
    {
      ensureUserById: async () => ({ id: 'user-1', email: 'user@example.com' }),
      findProfileByUserId: async () => ({
        targetLevel: 'MID',
        englishLevel: 'INTERMEDIATE',
      }),
    } as never,
    {
      evaluateInterviewAnswer: async (input: Record<string, unknown>) => {
        capturedTechnicalLevel = input.targetLevel as string
        return {
          result: {
            technicalScore: 85,
            englishScore: 70,
            clarityScore: 80,
            overallScore: 81,
            summary: 'Good answer',
            strengths: ['structure'],
            improvements: ['add example'],
            weakConcepts: ['TTL'],
            nextRecommendedQuestion: {
              question: 'What happens on hot keys?',
              difficulty: 'HARD',
              reason: 'stress test',
            },
            recommendedLearning: {
              title: 'Redis review',
              reason: 'shore up TTL depth',
              action: 'practice',
            },
          },
          metadata: {
            provider: 'mock',
            model: 'mock-model',
            promptKey: 'interview-evaluation.v1',
            promptVersion: 'v1',
            schemaKey: 'interview_evaluation',
            schemaVersion: 'v1',
            inputHash: 'hash-1',
            validationStatus: 'success',
            tokenUsage: { totalTokens: 11 },
            latencyMs: 3,
            generatedAt: new Date().toISOString(),
          },
        }
      },
      generateEnglishFeedback: async (input: Record<string, unknown>) => {
        capturedEnglishLevel = input.targetLevel as string
        return {
          result: {
            overallScore: 74,
            feedback: 'Clear enough',
            notes: [],
            weakTopics: ['sentence clarity'],
          },
          metadata: {
            provider: 'mock',
            model: 'mock-model',
            promptKey: 'english-feedback.v1',
            promptVersion: 'v1',
            schemaKey: 'english_feedback',
            schemaVersion: 'v1',
            inputHash: 'hash-2',
            validationStatus: 'success',
            tokenUsage: { totalTokens: 9 },
            latencyMs: 2,
            generatedAt: new Date().toISOString(),
          },
        }
      },
    } as never,
  )

  await service.answerQuestion({ id: 'user-1' }, 'session-1', {
    answer: 'I would start with TTL and selective invalidation.',
    advancedSettings: {
      targetLevel: 'SENIOR',
      englishLevel: 'ADVANCED',
      targetRole: 'Staff Engineer',
      techStack: ['Redis', 'PostgreSQL'],
      interviewGoals: ['Deeper tradeoffs'],
      preferredOutputStyle: 'Direct',
    },
  })

  assert.equal(capturedTechnicalLevel, 'SENIOR')
  assert.equal(capturedEnglishLevel, 'ADVANCED')
  assert.equal(savedPayload?.overrideRole, 'Staff Engineer')
  assert.deepEqual(savedPayload?.overrideStack, ['Redis', 'PostgreSQL'])
  assert.equal(
    (savedPayload?.aiMetadata as { promptKey?: string } | undefined)?.promptKey,
    'interview-evaluation.v1',
  )
  assert.equal(englishMetadata?.promptKey, 'english-feedback.v1')
})
