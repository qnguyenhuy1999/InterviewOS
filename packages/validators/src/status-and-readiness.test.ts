import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EnglishNoteStatus,
  LearningPathItemStatus,
  NoteStatus,
  QuestionDifficulty,
  ReviewRating,
  WeakConceptStatus,
} from '@interviewos/types'

import { companyModeConfigSchema } from './company-mode'
import {
  englishNoteStatusSchema,
  learningPathActionSchema,
  learningPathStatusSchema,
  noteStatusSchema,
  reviewRatingSchema,
  weakConceptStatusSchema,
} from './learning'
import { readinessSnapshotSchema } from './readiness'

test('status schemas only accept supported workflow states', () => {
  assert.equal(noteStatusSchema.safeParse({ status: NoteStatus.MASTERED }).success, true)
  assert.equal(englishNoteStatusSchema.safeParse({ status: EnglishNoteStatus.IMPROVED }).success, true)
  assert.equal(weakConceptStatusSchema.safeParse({ status: WeakConceptStatus.RESOLVED }).success, true)
  assert.equal(reviewRatingSchema.safeParse({ rating: ReviewRating.GOOD }).success, true)
  assert.equal(learningPathStatusSchema.safeParse(LearningPathItemStatus.IN_PROGRESS).success, true)

  assert.equal(noteStatusSchema.safeParse({ status: 'DONE' }).success, false)
  assert.equal(reviewRatingSchema.safeParse({ rating: 'OK' }).success, false)
})

test('learningPathActionSchema accepts the public action vocabulary', () => {
  for (const action of ['start', 'complete', 'snooze', 'skip']) {
    assert.equal(learningPathActionSchema.safeParse({ action }).success, true)
  }

  assert.equal(learningPathActionSchema.safeParse({ action: 'archive' }).success, false)
})

test('readinessSnapshotSchema bounds scores, confidence, weights, and trends', () => {
  assert.equal(
    readinessSnapshotSchema.safeParse({
      overallScore: 82,
      confidenceLevel: 0.7,
      breakdown: [{ dimension: 'System design', score: 75, weight: 0.4, label: 'Strong', trend: 'UP' }],
      improvementAreas: ['Clarify tradeoffs'],
    }).success,
    true,
  )

  assert.equal(
    readinessSnapshotSchema.safeParse({
      overallScore: 101,
      confidenceLevel: 1.2,
      breakdown: [{ dimension: '', score: 120, weight: 1.4, label: '', trend: 'SIDEWAYS' }],
      improvementAreas: ['Clarify tradeoffs'],
    }).success,
    false,
  )
})

test('companyModeConfigSchema validates interviewer behavior and bounded criteria', () => {
  const config = {
    interviewerPersona: 'Direct system design interviewer',
    difficultyProfile: {
      startingDifficulty: QuestionDifficulty.MEDIUM,
      escalationRate: 'MEDIUM',
      maxDifficulty: QuestionDifficulty.EXPERT,
    },
    followUpBehavior: {
      maxFollowUpsPerQuestion: 3,
      challengeThreshold: 0.7,
      clarificationThreshold: 0.3,
    },
    evaluationCriteria: {
      weights: { architecture: 0.5, communication: 0.5 },
      rubric: 'Score tradeoffs, constraints, and clarity.',
    },
    feedbackStyle: 'COACHING',
    questionBank: ['Design a news feed.'],
    emphasis: { technicalDepth: 0.8, productThinking: 0.4 },
    interviewStyle: { probingDepth: 'HIGH', expectedPace: 'STEADY', prefersBreadth: false },
  }

  assert.equal(companyModeConfigSchema.safeParse(config).success, true)
  assert.equal(
    companyModeConfigSchema.safeParse({
      ...config,
      followUpBehavior: { ...config.followUpBehavior, challengeThreshold: 1.5 },
    }).success,
    false,
  )
})
