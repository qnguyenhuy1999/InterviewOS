import assert from 'node:assert/strict'

import { InterviewStatus, InterviewType, QuestionDifficulty } from '@interviewos/types'
import { test } from 'vitest'

import { interviewSessionFixtureSession, interviewSessionFixtureTurns } from './InterviewSessionPage.fixtures'
import type { InterviewSessionPageSession } from './InterviewSessionPage.types'
import {
  formatInterviewSessionDateLabel,
  formatInterviewSessionSignedValue,
  getInterviewSessionCompletedTurns,
  getInterviewSessionHeaderDescription,
  getInterviewSessionState,
} from './InterviewSessionPage.utils'

test('interview session formatters handle invalid dates and signed deltas', () => {
  assert.equal(formatInterviewSessionDateLabel(null), 'Unknown')
  assert.equal(formatInterviewSessionDateLabel('not-a-date'), 'Unknown')
  assert.equal(formatInterviewSessionSignedValue(4), '+4')
  assert.equal(formatInterviewSessionSignedValue(-2), '-2')
})

test('interview session helpers count completed turns by session mode', () => {
  assert.equal(getInterviewSessionCompletedTurns(interviewSessionFixtureSession, interviewSessionFixtureTurns), 1)

  const standardSession: InterviewSessionPageSession = {
    ...interviewSessionFixtureSession,
    id: 'standard-session',
    type: InterviewType.TECHNICAL,
    mode: 'STANDARD',
    status: InterviewStatus.COMPLETED,
    questions: [
      {
        id: 'question-1',
        question: 'Explain debounce.',
        difficulty: QuestionDifficulty.EASY,
        category: 'Frontend',
        expectedConcepts: ['debounce'],
        answer: {
          rawAnswer: 'Delay work until typing stops.',
          overallScore: null,
          technicalFeedback: null,
          weakConcepts: [],
        },
      },
    ],
  }

  assert.equal(getInterviewSessionCompletedTurns(standardSession, []), 1)
})

test('interview session state derives loading, error, empty, and ready states', () => {
  assert.deepEqual(getInterviewSessionState({ loading: true }), { kind: 'loading' })
  assert.deepEqual(getInterviewSessionState({ error: 'Could not load' }), {
    kind: 'error',
    message: 'Could not load',
  })
  assert.deepEqual(getInterviewSessionState({}), { kind: 'empty' })
  assert.equal(
    getInterviewSessionState({
      session: interviewSessionFixtureSession,
      turns: interviewSessionFixtureTurns,
    }).kind,
    'ready',
  )
  assert.match(getInterviewSessionHeaderDescription(interviewSessionFixtureSession), /SYSTEM_DESIGN/)
})
