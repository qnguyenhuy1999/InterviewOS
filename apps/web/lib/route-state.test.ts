import assert from 'node:assert/strict'
import test from 'node:test'

import { getRouteErrorMessage, loadRouteData, toRouteState } from './route-state'

test('toRouteState returns empty or ready based on the provided predicate', () => {
  assert.deepEqual(
    toRouteState([], (items) => items.length === 0),
    { kind: 'empty' },
  )
  assert.deepEqual(
    toRouteState(['note-1'], (items) => items.length === 0),
    {
      kind: 'ready',
      data: ['note-1'],
    },
  )
})

test('loadRouteData converts successful, empty, and failed loaders into route states', async () => {
  assert.deepEqual(await loadRouteData(async () => ({ id: 'note-1' })), {
    kind: 'ready',
    data: { id: 'note-1' },
  })
  assert.deepEqual(
    await loadRouteData(async () => [], { isEmpty: (items) => items.length === 0 }),
    {
      kind: 'empty',
    },
  )
  assert.deepEqual(
    await loadRouteData(async () => {
      throw new Error('Nope')
    }),
    {
      kind: 'error',
      message: 'Nope',
    },
  )
})

test('getRouteErrorMessage uses fallback for non-error and blank-error values', () => {
  assert.equal(getRouteErrorMessage('bad'), 'Something went wrong while loading this page.')
  assert.equal(getRouteErrorMessage(new Error('   '), 'Fallback'), 'Fallback')
})
