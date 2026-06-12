import assert from 'node:assert/strict'
import test from 'node:test'

import { average, clampScore, percentOf } from '.'

test('clampScore clamps to 0-100', () => {
  assert.equal(clampScore(-10), 0)
  assert.equal(clampScore(110), 100)
  assert.equal(clampScore(75.6), 76)
})

test('clampScore respects custom min/max', () => {
  assert.equal(clampScore(5, 10, 50), 10)
  assert.equal(clampScore(60, 10, 50), 50)
})

test('percentOf returns 0 for zero total', () => {
  assert.equal(percentOf(10, 0), 0)
})

test('percentOf computes correct percentage', () => {
  assert.equal(percentOf(50, 200), 25)
})

test('average computes mean', () => {
  assert.equal(average([10, 20, 30]), 20)
})

test('average returns 0 for empty array', () => {
  assert.equal(average([]), 0)
})
