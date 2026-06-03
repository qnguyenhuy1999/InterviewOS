import assert from 'node:assert/strict'
import test from 'node:test'

import { EnglishLevel, ExperienceLevel, NoteType, QuestionDifficulty } from '@interviewos/types'

import { AIGateway } from './gateway'

test('AIGateway rejects invalid structured provider output', async () => {
  const gateway = new AIGateway({
    generateText: async () => ({ text: 'ok' }),
    generateStructured: async <T>() => ({ data: {} as T }),
    transcribeAudio: async () => ({ text: 'ok' }),
    textToSpeech: async () => ({ audioBuffer: new Uint8Array(0) }),
    generateTechnicalNote: async () =>
      ({
        title: 'Broken note',
        content: {
          purpose: 'Missing required arrays',
        },
        sections: [],
      }) as never,
    improveTechnicalNote: async () => ({ title: 'x', content: 'y', improvements: [] }),
    generateQuestionsFromNote: async () => ({
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
    }),
    evaluateInterviewAnswer: async () => ({
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
    }),
    generateEnglishFeedback: async () => ({
      overallScore: 80,
      feedback: 'ok',
      notes: [],
      weakTopics: [],
    }),
    recommendNextLearning: async () => ({ recommendations: [] }),
    analyzeResume: async () => ({
      score: 70,
      strengths: ['typescript'],
      gaps: ['cloud'],
      recommendations: ['add cloud'],
      keySkillsFound: ['typescript'],
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
    /quickReference/,
  )
})
