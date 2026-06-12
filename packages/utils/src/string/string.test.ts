import assert from 'node:assert/strict'
import test from 'node:test'

import { trimTrailingSlash, truncate, truncatePromptContent, wrapUserInput } from '.'

test('wrapUserInput wraps in user_input tags', () => {
  assert.equal(wrapUserInput('hello'), '<user_input>hello</user_input>')
})

test('trimTrailingSlash removes trailing slash', () => {
  assert.equal(trimTrailingSlash('https://api.example.com/'), 'https://api.example.com')
})

test('trimTrailingSlash leaves no-slash unchanged', () => {
  assert.equal(trimTrailingSlash('https://api.example.com'), 'https://api.example.com')
})

test('truncate shortens long strings', () => {
  assert.equal(truncate('hello world', 8), 'hello...')
})

test('truncate leaves short strings unchanged', () => {
  assert.equal(truncate('hi', 10), 'hi')
})

test('truncatePromptContent serialises and truncates at maxChars', () => {
  const long = 'x'.repeat(10_000)
  const result = truncatePromptContent(long, 100)
  assert.ok(result.endsWith('...[truncated]'))
  assert.ok(result.length <= 115)
})

test('truncatePromptContent passes through short content unchanged', () => {
  const result = truncatePromptContent({ key: 'value' }, 8_000)
  assert.equal(result, JSON.stringify({ key: 'value' }))
})
