import assert from 'node:assert/strict'

import { test } from 'vitest'

import { readinessPageFixture } from './ReadinessPage.fixtures'
import {
  getBestReadinessDimension,
  getReadinessDeltaLabel,
  getReadinessHistoryDateLabel,
  getReadinessTrend,
} from './ReadinessPage.utils'

test('readiness helpers derive trends and labels from numeric deltas', () => {
  assert.equal(getReadinessTrend(4), 'UP')
  assert.equal(getReadinessTrend(-1), 'DOWN')
  assert.equal(getReadinessTrend(0), 'STABLE')
  assert.equal(getReadinessDeltaLabel(4), '+4 pts')
  assert.equal(getReadinessDeltaLabel(-1), '-1 pts')
  assert.equal(getReadinessDeltaLabel(0), 'No change')
})

test('readiness helpers identify best dimensions and history labels', () => {
  assert.equal(
    getBestReadinessDimension(readinessPageFixture.latest.breakdown).dimension,
    'reviewCompletion',
  )
  assert.equal(getReadinessHistoryDateLabel(new Date('2020-01-02T03:04:00')), 'Jan 2')
})
