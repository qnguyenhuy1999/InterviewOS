import assert from 'node:assert/strict'
import test from 'node:test'

import { groupBy, parseCommaSeparated, splitCommaSeparated, unique } from '.'

test('splitCommaSeparated splits and trims', () => {
  assert.deepEqual(splitCommaSeparated('a, b,  c'), ['a', 'b', 'c'])
})

test('splitCommaSeparated filters empty strings', () => {
  assert.deepEqual(splitCommaSeparated('a,,b'), ['a', 'b'])
})

test('parseCommaSeparated is alias for splitCommaSeparated', () => {
  assert.equal(parseCommaSeparated, splitCommaSeparated)
})

test('unique removes duplicates', () => {
  assert.deepEqual(unique([1, 2, 2, 3, 1]), [1, 2, 3])
})

test('groupBy groups items by key', () => {
  const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }]
  const result = groupBy(items, (i) => i.type)
  assert.equal(result.a.length, 2)
  assert.equal(result.b.length, 1)
})
