import assert from 'node:assert/strict'

import { test } from 'vitest'

import { sessionPageFixture } from './SessionPage.fixtures'
import {
  formatSessionCreatedLabel,
  formatSessionLastSeenLabel,
  getSessionDevicePresentation,
  getSessionSummary,
} from './SessionPage.utils'

test('session device presentation extracts browser, device, and mobile icon intent', () => {
  const desktop = getSessionDevicePresentation(sessionPageFixture.sessions[0])
  const mobile = getSessionDevicePresentation(sessionPageFixture.sessions[1])

  assert.equal(desktop.deviceLabel, 'MacBook Pro')
  assert.equal(desktop.browserLabel, 'Chrome 126')
  assert.equal(mobile.deviceLabel, 'iPhone')
  assert.equal(mobile.browserLabel, 'Safari 17')
  assert.notEqual(desktop.icon, mobile.icon)
})

test('session summary and date labels handle current and historical sessions', () => {
  assert.deepEqual(getSessionSummary(sessionPageFixture.sessions), {
    total: 3,
    currentSessionId: 'session-current',
    currentSessionLabel: 'MacBook Pro',
  })
  assert.equal(formatSessionLastSeenLabel(null), 'Active now')
  assert.equal(formatSessionCreatedLabel(new Date('2020-01-02T03:04:00')), 'Jan 2, 2020')
})
