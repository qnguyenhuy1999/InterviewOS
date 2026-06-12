import assert from 'node:assert/strict'
import test from 'node:test'

import { formatDate, formatRelativeDate } from '.'

test('formatDate returns formatted string for ISO date string', () => {
  assert.equal(formatDate('2024-03-15'), 'Mar 15, 2024')
})

test('formatDate returns Not available for null', () => {
  assert.equal(formatDate(null), 'Not available')
})

test('formatDate returns Not available for undefined', () => {
  assert.equal(formatDate(undefined), 'Not available')
})

test('formatDate accepts Date object', () => {
  assert.equal(formatDate(new Date('2024-06-01')), 'Jun 1, 2024')
})

test('formatDate returns Invalid date for bad string', () => {
  assert.equal(formatDate('not-a-date'), 'Invalid date')
})

test('formatRelativeDate returns suffix string', () => {
  const result = formatRelativeDate(new Date())
  assert.ok(result.includes('ago') || result.includes('less than'), `unexpected: ${result}`)
})
