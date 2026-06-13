import assert from 'node:assert/strict'

import { InterviewType } from '@interviewos/types'
import { test } from 'vitest'

import { INTERVIEW_PAGE_ALL_TOPICS_VALUE } from './InterviewPage.constants'
import { interviewPageFixture } from './InterviewPage.fixtures'
import {
  filterInterviewSessions,
  formatInterviewDateLabel,
  formatInterviewDurationLabel,
  formatInterviewScore,
  getInterviewTopicLabel,
  getInterviewTopicOptions,
} from './InterviewPage.utils'

test('interview topic helpers prefer note titles and fall back to type labels', () => {
  const fallbackSession = {
    ...interviewPageFixture.sessions[0],
    id: 'session-without-note',
    type: InterviewType.BEHAVIORAL,
    note: null,
  }

  assert.equal(getInterviewTopicLabel(interviewPageFixture.sessions[0]), 'React internals')
  assert.equal(getInterviewTopicLabel(fallbackSession), 'Behavioral')
  assert.deepEqual(getInterviewTopicOptions([fallbackSession]), [
    { value: INTERVIEW_PAGE_ALL_TOPICS_VALUE, label: 'All topics' },
    { value: 'Behavioral', label: 'Behavioral' },
  ])
})

test('filterInterviewSessions respects the all topics sentinel', () => {
  assert.equal(
    filterInterviewSessions(interviewPageFixture.sessions, INTERVIEW_PAGE_ALL_TOPICS_VALUE).length,
    interviewPageFixture.sessions.length,
  )
  assert.deepEqual(
    filterInterviewSessions(interviewPageFixture.sessions, 'React internals').map(
      (session) => session.id,
    ),
    ['session-react-internals'],
  )
})

test('interview formatters handle missing values and fixed dates', () => {
  assert.equal(formatInterviewDateLabel(null), 'Not started')
  assert.equal(formatInterviewDateLabel(new Date('2020-01-02T03:04:00')), 'Jan 2, 03:04')
  assert.equal(formatInterviewDurationLabel(32), '32 min')
  assert.equal(formatInterviewScore(null), 'N/A')
  assert.equal(formatInterviewScore(84), '84')
})
