import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()

async function read(relativePath: string) {
  return readFile(path.join(root, relativePath), 'utf8')
}

test('review route uses an app-local client wrapper instead of passing function props from the server', async () => {
  const page = await read('apps/web/app/(app)/review/page.tsx')
  const clientWrapper = await read('apps/web/app/(app)/review/ReviewPageClient.tsx')

  assert.match(page, /import ReviewPageClient from '\.\/ReviewPageClient'/)
  assert.doesNotMatch(page, /@interviewos\/ui\/pages\/ReviewPage/)
  assert.match(clientWrapper, /^'use client'/)
  assert.match(clientWrapper, /renderRatingActions=\{/)
  assert.match(clientWrapper, /renderLearningPathActions=\{/)
  assert.match(clientWrapper, /renderWeakConceptActions=\{/)
})

test('learning path route uses an app-local client wrapper instead of passing function props from the server', async () => {
  const page = await read('apps/web/app/(app)/learning-path/page.tsx')
  const clientWrapper = await read('apps/web/app/(app)/learning-path/LearningPathPageClient.tsx')

  assert.match(page, /import LearningPathPageClient from '\.\/LearningPathPageClient'/)
  assert.doesNotMatch(page, /@interviewos\/ui\/pages\/LearningPathPage/)
  assert.match(clientWrapper, /^'use client'/)
  assert.match(clientWrapper, /renderItemActions=\{/)
})
