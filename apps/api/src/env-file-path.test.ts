import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveApiEnvFilePath } from './env-file-path'

test('resolveApiEnvFilePath targets the repository .env from the source tree', () => {
  assert.equal(
    resolveApiEnvFilePath('/Users/mac/Desktop/InterviewOS/apps/api/src'),
    '/Users/mac/Desktop/InterviewOS/.env',
  )
})

test('resolveApiEnvFilePath targets the repository .env from the built dist tree', () => {
  assert.equal(
    resolveApiEnvFilePath('/Users/mac/Desktop/InterviewOS/apps/api/dist'),
    '/Users/mac/Desktop/InterviewOS/.env',
  )
})
