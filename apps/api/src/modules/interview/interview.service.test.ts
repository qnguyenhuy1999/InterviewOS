import assert from 'node:assert/strict'
import test from 'node:test'

import { InterviewService } from './interview.service'

test('InterviewService lets session overrides replace saved defaults', async () => {
  let capturedTechnicalLevel: string | undefined
  let capturedEnglishLevel: string | undefined
  let savedPayload: Record<string, unknown> | undefined

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
      saveEnglishNotes: async () => [],
      upsertWeakConcepts: async () => undefined,
      upsertEnglishWeaknesses: async () => undefined,
    } as never,
    {} as never,
    {
      ensureUserByEmail: async () => ({ id: 'user-1', email: 'user@example.com' }),
      findProfileByUserId: async () => ({
        targetLevel: 'MID',
        englishLevel: 'INTERMEDIATE',
      }),
    } as never,
    {
      evaluateInterviewAnswer: async (input: Record<string, unknown>) => {
        capturedTechnicalLevel = input.targetLevel as string
        return {
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
        }
      },
      generateEnglishFeedback: async (input: Record<string, unknown>) => {
        capturedEnglishLevel = input.targetLevel as string
        return {
          overallScore: 74,
          feedback: 'Clear enough',
          notes: [],
          weakTopics: ['sentence clarity'],
        }
      },
    } as never,
  )

  await service.answerQuestion({ email: 'user@example.com' }, 'session-1', {
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
})
