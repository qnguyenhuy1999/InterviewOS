import assert from 'node:assert/strict'
import test from 'node:test'

import { EnglishLevel, ExperienceLevel, NoteType, QuestionDifficulty } from '@interviewos/types'

import { AIGateway, AIResponseValidationError } from './gateway'

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
  latencyMs: 3,
  generatedAt: new Date().toISOString(),
}

test('AIGateway rejects invalid structured provider output and preserves metadata', async () => {
  const gateway = new AIGateway({
    generateText: async () => ({ result: { text: 'ok' }, metadata }),
    generateStructured: async <T>() => ({ result: { data: {} as T }, metadata }),
    transcribeAudio: async () => ({ text: 'ok' }),
    textToSpeech: async () => ({ audioBuffer: new Uint8Array(0) }),
    generateTechnicalNote: async () => ({
      result: {
        title: 'Broken note',
        content: {
          purpose: 'Missing required arrays',
        },
        sections: [],
      } as never,
      metadata,
    }),
    improveTechnicalNote: async () => ({
      result: { title: 'x', content: 'y', improvements: [] },
      metadata,
    }),
    generateQuestionsFromNote: async () => ({
      result: {
        questions: [
          {
            question: 'Q',
            category: 'C',
            expectedAnswer: 'A',
            difficulty: QuestionDifficulty.MEDIUM,
            expectedConcepts: ['concept'],
            sourceSection: 'core',
          },
        ],
      },
      metadata,
    }),
    evaluateInterviewAnswer: async () => ({
      result: {
        technicalScore: 80,
        englishScore: 80,
        clarityScore: 80,
        overallScore: 80,
        summary: 'ok',
        strengths: ['clarity'],
        improvements: ['depth'],
        weakConcepts: ['redis'],
        nextRecommendedQuestion: {
          question: 'next',
          difficulty: QuestionDifficulty.HARD,
          reason: 'depth',
        },
        recommendedLearning: {
          title: 'redis',
          reason: 'review',
          action: 'practice',
        },
      },
      metadata,
    }),
    generateEnglishFeedback: async () => ({
      result: {
        overallScore: 80,
        feedback: 'ok',
        notes: [],
        weakTopics: [],
      },
      metadata,
    }),
    recommendNextLearning: async () => ({ result: { recommendations: [] }, metadata }),
    analyzeResume: async () => ({
      result: {
        score: 70,
        strengths: ['typescript'],
        gaps: ['cloud'],
        recommendations: ['add cloud'],
        keySkillsFound: ['typescript'],
      },
      metadata,
    }),
  })

  await assert.rejects(
    () =>
      gateway.generateTechnicalNote({
        topic: 'Redis',
        noteType: NoteType.CONCEPT,
        targetLevel: ExperienceLevel.SENIOR,
        targetRole: 'Backend Engineer',
        englishLevel: EnglishLevel.INTERMEDIATE,
      }),
    (error: unknown) => {
      assert.ok(error instanceof AIResponseValidationError)
      assert.equal(error.metadata.validationStatus, 'validation_failed')
      assert.equal(error.metadata.promptKey, 'technical-note.v1')
      return true
    },
  )
})

test('AIGateway backfills missing depth-expansion fields for technical notes', async () => {
  const gateway = new AIGateway({
    generateText: async () => ({ result: { text: 'ok' }, metadata }),
    generateStructured: async <T>() => ({ result: { data: {} as T }, metadata }),
    transcribeAudio: async () => ({ text: 'ok' }),
    textToSpeech: async () => ({ audioBuffer: new Uint8Array(0) }),
    generateTechnicalNote: async () => ({
      result: {
        title: 'Legacy note',
        content: {
          purpose: 'Understand Redis caching tradeoffs.',
          quickReference: ['Know cache-aside.'],
          coreConcepts: ['Eviction policies'],
          mentalModel: 'Cache hot paths, not everything.',
          productionUsage: ['Use caching for read-heavy endpoints.'],
          practicalExamples: ['Product detail pages'],
          commonPitfalls: ['Stale cache'],
          debuggingChecklist: ['Check TTL'],
          productionChecklist: ['Define invalidation'],
          seniorInterviewSignals: ['Discuss consistency tradeoffs'],
        },
        sections: [{ heading: 'Purpose', content: 'Why Redis caching matters.' }],
      },
      metadata,
    }),
    improveTechnicalNote: async () => ({
      result: { title: 'x', content: 'y', improvements: [] },
      metadata,
    }),
    generateQuestionsFromNote: async () => ({
      result: {
        questions: [
          {
            question: 'Q',
            category: 'C',
            expectedAnswer: 'A',
            difficulty: QuestionDifficulty.MEDIUM,
            expectedConcepts: ['concept'],
            sourceSection: 'core',
          },
        ],
      },
      metadata,
    }),
    evaluateInterviewAnswer: async () => ({
      result: {
        technicalScore: 80,
        englishScore: 80,
        clarityScore: 80,
        overallScore: 80,
        summary: 'ok',
        strengths: ['clarity'],
        improvements: ['depth'],
        weakConcepts: ['redis'],
        nextRecommendedQuestion: {
          question: 'next',
          difficulty: QuestionDifficulty.HARD,
          reason: 'depth',
        },
        recommendedLearning: {
          title: 'redis',
          reason: 'review',
          action: 'practice',
        },
      },
      metadata,
    }),
    generateEnglishFeedback: async () => ({
      result: {
        overallScore: 80,
        feedback: 'ok',
        notes: [],
        weakTopics: [],
      },
      metadata,
    }),
    recommendNextLearning: async () => ({ result: { recommendations: [] }, metadata }),
    analyzeResume: async () => ({
      result: {
        score: 70,
        strengths: ['typescript'],
        gaps: ['cloud'],
        recommendations: ['add cloud'],
        keySkillsFound: ['typescript'],
      },
      metadata,
    }),
  })

  const result = await gateway.generateTechnicalNote({
    topic: 'Redis',
    noteType: NoteType.CONCEPT,
    targetLevel: ExperienceLevel.SENIOR,
    targetRole: 'Backend Engineer',
    englishLevel: EnglishLevel.INTERMEDIATE,
  })

  assert.equal(result.result.title, 'Legacy note')
  assert.equal(result.result.content.purpose, 'Understand Redis caching tradeoffs.')
  assert.match(result.result.content.summary ?? '', /redis caching tradeoffs/i)
  assert.match(result.result.content.directAnswer ?? '', /redis caching tradeoffs/i)
  assert.match(result.result.content.deepTheory ?? '', /cache hot paths/i)
  assert.deepEqual(result.result.content.internals, ['Eviction policies'])
  assert.deepEqual(result.result.content.edgeCases, ['Stale cache'])
  assert.deepEqual(result.result.content.commonMistakes, ['Stale cache'])
  assert.equal(result.result.content.tradeoffs?.length, 1)
  assert.equal(result.result.content.interviewFollowUps?.length, 1)
})
