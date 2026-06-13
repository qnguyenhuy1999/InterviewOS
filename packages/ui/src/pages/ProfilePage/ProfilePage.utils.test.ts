import assert from 'node:assert/strict'

import { test } from 'vitest'

import {
  getProfileAcceptedFileLabel,
  getProfileNavigation,
  getProfileVerifiedBadgeClassName,
} from './ProfilePage.utils'

test('profile navigation marks the Profile item active', () => {
  const items = getProfileNavigation().flatMap((group) => group.items)

  assert.equal(items.find((item) => item.label === 'Profile')?.isActive, true)
  assert.equal(items.find((item) => item.label === 'Dashboard')?.isActive, false)
})

test('profile helpers format upload constraints and verification tones', () => {
  assert.equal(getProfileAcceptedFileLabel(['PDF', 'DOCX'], 5), 'PDF or DOCX, up to 5MB')
  assert.match(getProfileVerifiedBadgeClassName(true), /primary/)
  assert.match(getProfileVerifiedBadgeClassName(false), /muted/)
})
