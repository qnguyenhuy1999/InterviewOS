import assert from 'node:assert/strict'
import test from 'node:test'

import { API_BASE_PATH, API_ROUTES, API_VERSION, envSchema } from './index'

const requiredEnv = {
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/interviewos',
  REDIS_URL: 'redis://localhost:6379',
}

test('envSchema applies defaults and coerces numeric environment values', () => {
  const env = envSchema.parse({
    ...requiredEnv,
    AUTH_SESSION_TTL_DAYS: '14',
    PASSWORD_RESET_TTL_MINUTES: '45',
    EMAIL_VERIFICATION_TTL_HOURS: '48',
  })

  assert.equal(env.AUTH_COOKIE_NAME, 'interviewos_session')
  assert.equal(env.AUTH_SESSION_TTL_DAYS, 14)
  assert.equal(env.PASSWORD_RESET_TTL_MINUTES, 45)
  assert.equal(env.EMAIL_VERIFICATION_TTL_HOURS, 48)
  assert.equal(env.WEB_APP_URL, 'http://localhost:3000')
  assert.equal(env.EMAIL_PROVIDER, 'console')
  assert.equal(env.OPENAI_MODEL, 'gpt-5.4-mini')
  assert.equal(env.AI_PROVIDER, 'mock')
  assert.equal(env.NODE_ENV, 'development')
})

test('envSchema rejects invalid urls and out-of-range lifetimes', () => {
  assert.equal(envSchema.safeParse({ ...requiredEnv, DATABASE_URL: 'not-a-url' }).success, false)
  assert.equal(envSchema.safeParse({ ...requiredEnv, AUTH_SESSION_TTL_DAYS: 31 }).success, false)
  assert.equal(
    envSchema.safeParse({ ...requiredEnv, PASSWORD_RESET_TTL_MINUTES: 4 }).success,
    false,
  )
  assert.equal(
    envSchema.safeParse({ ...requiredEnv, EMAIL_VERIFICATION_TTL_HOURS: 169 }).success,
    false,
  )
})

test('API route constants expose stable base paths and parameter builders', () => {
  assert.equal(API_VERSION, 'v1')
  assert.equal(API_BASE_PATH, '/api/v1')
  assert.equal(API_ROUTES.auth.sessionById('session-1'), '/auth/sessions/session-1')
  assert.equal(API_ROUTES.notes.byId('note-1'), '/notes/note-1')
  assert.equal(API_ROUTES.sessions.answer('session-1'), '/sessions/session-1/answer')
  assert.equal(API_ROUTES.review.learningPathAction('item-1'), '/learning-path/item-1/action')
  assert.equal(API_ROUTES.companyModes.bySlug('amazon'), '/company-modes/amazon')
})
