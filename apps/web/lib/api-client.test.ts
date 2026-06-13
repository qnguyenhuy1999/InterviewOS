import assert from 'node:assert/strict'
import test from 'node:test'

import { absoluteApiPath, apiFetch, apiFetchJson } from './api-client'
import { ApiHttpError } from './api-error'

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL
const originalFetch = globalThis.fetch

function restoreGlobals() {
  if (originalApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl
  }
  globalThis.fetch = originalFetch
}

test.afterEach(restoreGlobals)

test('absoluteApiPath requires and uses NEXT_PUBLIC_API_URL', () => {
  delete process.env.NEXT_PUBLIC_API_URL
  assert.throws(() => absoluteApiPath('/auth/me'), /NEXT_PUBLIC_API_URL/)

  process.env.NEXT_PUBLIC_API_URL = 'http://api.local'
  assert.equal(absoluteApiPath('/auth/me'), 'http://api.local/auth/me')
})

test('apiFetch sends JSON content type by default and preserves explicit headers', async () => {
  process.env.NEXT_PUBLIC_API_URL = 'http://api.local'
  const calls: Array<{ url: string; init: RequestInit }> = []
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} })
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  await apiFetch('/notes')
  await apiFetch('/notes', { headers: { 'Content-Type': 'text/plain' } })

  assert.equal(calls[0].url, 'http://api.local/notes')
  assert.equal((calls[0].init.headers as Headers).get('Content-Type'), 'application/json')
  assert.equal((calls[1].init.headers as Headers).get('Content-Type'), 'text/plain')
  assert.equal(calls[0].init.credentials, 'include')
  assert.equal(calls[0].init.cache, 'no-store')
})

test('apiFetch leaves multipart requests without a synthetic JSON content type', async () => {
  process.env.NEXT_PUBLIC_API_URL = 'http://api.local'
  let capturedHeaders: Headers | undefined
  globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    capturedHeaders = init?.headers as Headers
    return new Response('{}', { status: 200 })
  }) as typeof fetch

  await apiFetch('/resume/upload', { body: new FormData() })

  assert.equal(capturedHeaders?.has('Content-Type'), false)
})

test('apiFetchJson returns JSON, handles 204 responses, and throws API errors', async () => {
  process.env.NEXT_PUBLIC_API_URL = 'http://api.local'
  const responses = [
    new Response(JSON.stringify({ id: 'note-1' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }),
    new Response(null, { status: 204 }),
    new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    }),
  ]
  globalThis.fetch = (async () => responses.shift()!) as typeof fetch

  assert.deepEqual(await apiFetchJson('/notes/note-1'), { id: 'note-1' })
  assert.equal(await apiFetchJson('/logout'), undefined)
  await assert.rejects(apiFetchJson('/auth/me'), (error) => {
    assert.equal(error instanceof ApiHttpError, true)
    assert.equal((error as ApiHttpError).status, 401)
    assert.equal((error as ApiHttpError).message, 'Unauthorized')
    return true
  })
})
