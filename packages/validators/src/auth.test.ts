import assert from 'node:assert/strict'
import test from 'node:test'

import {
  confirmEmailVerificationSchema,
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordFormSchema,
  resetPasswordSchema,
} from './auth'

test('loginSchema accepts valid credentials and rejects malformed credentials', () => {
  assert.deepEqual(loginSchema.parse({ email: 'ada@example.com', password: 'Password123!' }), {
    email: 'ada@example.com',
    password: 'Password123!',
  })

  assert.equal(loginSchema.safeParse({ email: 'bad-email', password: 'Password123!' }).success, false)
  assert.equal(loginSchema.safeParse({ email: 'ada@example.com', password: 'short' }).success, false)
})

test('registerSchema trims optional display names', () => {
  const parsed = registerSchema.parse({
    email: 'ada@example.com',
    password: 'Password123!',
    name: '  Ada Lovelace  ',
  })

  assert.equal(parsed.name, 'Ada Lovelace')
})

test('password reset schemas require usable tokens and matching confirmation', () => {
  assert.equal(requestPasswordResetSchema.safeParse({ email: 'ada@example.com' }).success, true)
  assert.equal(resetPasswordSchema.safeParse({ token: 'token-1', password: 'Password123!' }).success, true)
  assert.equal(confirmEmailVerificationSchema.safeParse({ token: 'verify-token' }).success, true)

  assert.equal(resetPasswordSchema.safeParse({ token: '   ', password: 'Password123!' }).success, false)
  assert.equal(
    resetPasswordFormSchema.safeParse({
      token: 'token-1',
      password: 'Password123!',
      confirmPassword: 'Different123!',
    }).success,
    false,
  )
})
