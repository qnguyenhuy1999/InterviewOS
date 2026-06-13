import assert from 'node:assert/strict'
import test from 'node:test'

import { ApiHttpError, createApiError, normalizeApiErrorMessage } from './api-error'

test('normalizeApiErrorMessage supports string, array, object, and empty messages', () => {
  assert.equal(normalizeApiErrorMessage('Invalid request'), 'Invalid request')
  assert.equal(
    normalizeApiErrorMessage(['Email is invalid', 'Password is short']),
    'Email is invalid, Password is short',
  )
  assert.equal(normalizeApiErrorMessage({ field: 'email' } as never), '{"field":"email"}')
  assert.equal(normalizeApiErrorMessage(undefined), null)
})

test('createApiError reads JSON API error payloads', async () => {
  const error = await createApiError(
    new Response(JSON.stringify({ message: ['Email is invalid'], error: 'Bad Request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    }),
  )

  assert.equal(error instanceof ApiHttpError, true)
  assert.equal(error.message, 'Email is invalid')
  assert.equal(error.status, 400)
  assert.deepEqual(error.cause, { message: ['Email is invalid'], error: 'Bad Request' })
})

test('createApiError falls back to text and status messages', async () => {
  assert.equal(
    (await createApiError(new Response('Gateway timeout', { status: 504 }))).message,
    'Gateway timeout',
  )
  assert.equal(
    (await createApiError(new Response('', { status: 500 }))).message,
    'API request failed with status 500',
  )
})
