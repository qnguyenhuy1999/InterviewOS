import assert from 'node:assert/strict'
import test from 'node:test'

import { QuestionDifficulty, StarDimension, TurnDecision } from '@interviewos/types'

import {
  englishFeedbackResultSchema,
  generatedQuestionsResultSchema,
  interviewAnswerResultSchema,
  recommendationResultSchema,
  resumeAnalysisResultSchema,
  technicalNoteResultSchema,
} from './ai'
import {
  behavioralEvalResultSchema,
  sessionEvaluationResultSchema,
  systemDesignEvalResultSchema,
} from './evaluation'
import { conductTurnResultSchema } from './interview-turn'

const technicalNoteContent = {
  purpose: 'Explain cache-aside.',
  quickReference: ['Read cache, miss, load DB, write cache.'],
  coreConcepts: ['TTL', 'invalidation'],
  mentalModel: 'Cache is a derived copy.',
  productionUsage: ['Use TTLs and explicit invalidation.'],
  practicalExamples: ['Profile lookups.'],
  commonPitfalls: ['Stale data.'],
  debuggingChecklist: ['Check hit rate.'],
  productionChecklist: ['Set memory limits.'],
  seniorInterviewSignals: ['Discuss consistency tradeoffs.'],
}

test('technicalNoteResultSchema requires structured content and rendered sections', () => {
  assert.equal(
    technicalNoteResultSchema.safeParse({
      title: 'Cache-aside',
      content: technicalNoteContent,
      sections: [{ heading: 'Overview', content: 'Use cache-aside for read-heavy data.' }],
    }).success,
    true,
  )

  assert.equal(
    technicalNoteResultSchema.safeParse({
      title: 'Cache-aside',
      content: { ...technicalNoteContent, quickReference: [] },
      sections: [],
    }).success,
    false,
  )
})

test('generated question and answer result schemas validate AI output bounds', () => {
  assert.equal(
    generatedQuestionsResultSchema.safeParse({
      questions: [
        {
          question: 'How do you invalidate a cache?',
          category: 'Caching',
          expectedAnswer: 'Discuss TTLs and explicit invalidation.',
          difficulty: QuestionDifficulty.MEDIUM,
          expectedConcepts: ['TTL'],
          sourceSection: 'Production usage',
        },
      ],
    }).success,
    true,
  )

  assert.equal(
    interviewAnswerResultSchema.safeParse({
      technicalScore: 90,
      englishScore: 88,
      clarityScore: 82,
      overallScore: 87,
      summary: 'Strong tradeoff awareness.',
      strengths: ['Covered invalidation'],
      improvements: ['Mention stampede prevention'],
      weakConcepts: ['Cache stampede'],
      nextRecommendedQuestion: {
        question: 'How would you prevent cache stampede?',
        difficulty: QuestionDifficulty.HARD,
        reason: 'Deepens production readiness.',
      },
      recommendedLearning: {
        title: 'Cache stampede controls',
        reason: 'Improves reliability answers.',
        action: 'Review locking and jitter.',
      },
    }).success,
    true,
  )

  assert.equal(
    interviewAnswerResultSchema.safeParse({
      technicalScore: 101,
      englishScore: 88,
      clarityScore: 82,
      overallScore: 87,
      summary: 'Invalid score.',
      strengths: [],
      improvements: [],
      weakConcepts: [],
      nextRecommendedQuestion: { question: '', difficulty: QuestionDifficulty.HARD, reason: '' },
      recommendedLearning: { title: '', reason: '', action: '' },
    }).success,
    false,
  )
})

test('english feedback, recommendation, and resume analysis schemas validate non-empty guidance', () => {
  assert.equal(
    englishFeedbackResultSchema.safeParse({
      overallScore: 75,
      feedback: 'Mostly clear.',
      notes: [
        {
          userSentence: 'I explain cache.',
          correctedSentence: 'I explained the cache.',
          naturalVersion: 'I explained how the cache works.',
          explanation: 'Use past tense for completed actions.',
          grammarTopic: 'Past tense',
          recommendedTopics: ['Tense consistency'],
          practicePatterns: ['I explained ...'],
        },
      ],
      weakTopics: ['Tense consistency'],
    }).success,
    true,
  )
  assert.equal(
    recommendationResultSchema.safeParse({
      recommendations: [{ topic: 'Cache stampede', reason: 'Common follow-up', priority: 1, action: 'Practice' }],
    }).success,
    true,
  )
  assert.equal(
    resumeAnalysisResultSchema.safeParse({
      score: 80,
      strengths: ['Backend ownership'],
      gaps: ['No explicit scale metrics'],
      recommendations: ['Add impact numbers'],
      keySkillsFound: ['TypeScript'],
    }).success,
    true,
  )
})

test('evaluation schemas bound scores and preserve rubric-specific feedback', () => {
  assert.equal(
    sessionEvaluationResultSchema.safeParse({
      overallScore: 86,
      confidence: 70,
      dimensionScores: {
        correctness: 8,
        depth: null,
        problemSolving: 9,
        clarity: 8,
        structure: 9,
        confidence: 7,
      },
      rubricScores: [{ key: 'tradeoffs', label: 'Tradeoffs', score: 80, evidence: ['Compared options'] }],
      strengths: ['Structured answer'],
      improvements: ['Quantify scale'],
      coachingNotes: ['Ask constraints first'],
      weakConcepts: ['Consistency models'],
    }).success,
    true,
  )

  assert.equal(
    behavioralEvalResultSchema.safeParse({
      starScores: {
        situation: 8,
        task: 7,
        action: 9,
        result: 6,
        overall: 8,
        completeness: 'COMPLETE',
      },
      missingDimensions: [StarDimension.RESULT],
      followUpQuestion: null,
      coachingFeedback: ['Quantify the result.'],
    }).success,
    true,
  )

  assert.equal(
    systemDesignEvalResultSchema.safeParse({
      designScores: {
        requirementsGathering: 8,
        scalability: 8,
        reliability: 7,
        tradeoffAnalysis: 9,
        technologyChoices: 8,
        architectureDepth: 7,
      },
      architectureInsights: ['Separated hot and cold paths.'],
      missedConsiderations: ['Backpressure'],
      coachingNotes: ['State assumptions earlier.'],
    }).success,
    true,
  )
})

test('conductTurnResultSchema validates multi-turn interviewer decisions', () => {
  assert.equal(
    conductTurnResultSchema.safeParse({
      decision: TurnDecision.FOLLOW_UP,
      nextQuestion: 'What consistency guarantee do you need?',
      reasoning: 'The previous answer skipped requirements.',
      topicTags: ['requirements'],
    }).success,
    true,
  )
  assert.equal(
    conductTurnResultSchema.safeParse({
      decision: 'ASK_AGAIN',
      nextQuestion: '',
      reasoning: '',
      topicTags: ['requirements'],
    }).success,
    false,
  )
})
