import assert from 'node:assert/strict'

import { test } from 'vitest'

import {
  interviewReviewFixtureEvaluation,
  interviewReviewFixtureSession,
} from './InterviewReviewPage.fixtures'
import {
  formatInterviewReviewDateLabel,
  formatInterviewReviewSignedValue,
  getInterviewReviewHeaderDescription,
  getInterviewReviewPendingMessage,
  getInterviewReviewState,
} from './InterviewReviewPage.utils'

test('interview review formatters handle invalid dates, ended sessions, and signed values', () => {
  assert.equal(formatInterviewReviewDateLabel(undefined), '--')
  assert.equal(formatInterviewReviewDateLabel('not-a-date'), '--')
  assert.equal(formatInterviewReviewDateLabel(new Date('2020-01-02T03:04:00')), 'Jan 2, 2020')
  assert.equal(formatInterviewReviewSignedValue(7), '+7')
  assert.equal(formatInterviewReviewSignedValue(0), '0')
  assert.equal(
    getInterviewReviewHeaderDescription({
      type: 'TECHNICAL',
      createdAt: '2020-01-02T03:04:00',
      endedAt: '2020-01-02T04:04:00',
    }),
    'TECHNICAL · Started Jan 2, 2020 · Ended Jan 2, 2020',
  )
})

test('interview review helpers distinguish published and pending evaluations', () => {
  assert.match(getInterviewReviewPendingMessage('COMPLETED'), /generated/i)
  assert.match(getInterviewReviewPendingMessage('IN_PROGRESS'), /end the session/i)
})

test('interview review state derives loading, error, empty, and ready states', () => {
  assert.deepEqual(getInterviewReviewState({ loading: true }), { kind: 'loading' })
  assert.deepEqual(getInterviewReviewState({ error: 'Could not load' }), {
    kind: 'error',
    message: 'Could not load',
  })
  assert.deepEqual(getInterviewReviewState({}), { kind: 'empty' })
  assert.equal(
    getInterviewReviewState({
      session: interviewReviewFixtureSession,
      turns: [],
      evaluation: interviewReviewFixtureEvaluation,
    }).kind,
    'ready',
  )
})
