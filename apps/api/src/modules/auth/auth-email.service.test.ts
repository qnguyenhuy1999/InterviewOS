import assert from 'node:assert/strict'
import test from 'node:test'

import { AuthEmailService } from './auth-email.service'
import {
  formatPasswordResetConsoleMessage,
  formatVerificationConsoleMessage,
} from './auth-email.service'

test('console auth email messages include the delivery link', () => {
  const verificationMessage = formatVerificationConsoleMessage({
    email: 'verify@example.com',
    link: 'http://localhost:3000/verify-email?token=verify-token',
  })
  const passwordResetMessage = formatPasswordResetConsoleMessage({
    email: 'reset@example.com',
    link: 'http://localhost:3000/reset-password?token=reset-token',
  })

  assert.match(verificationMessage, /verify@example.com/)
  assert.match(verificationMessage, /verify-email\?token=verify-token/)
  assert.match(passwordResetMessage, /reset@example.com/)
  assert.match(passwordResetMessage, /reset-password\?token=reset-token/)
})

test('AuthEmailService blocks console delivery in production', () => {
  assert.throws(
    () =>
      new AuthEmailService({
        get: (key: string, fallback?: unknown) => {
          if (key === 'email.provider') return 'console'
          if (key === 'app.env') return 'production'
          return fallback
        },
      } as never),
    /Console email provider is not allowed in production/,
  )
})

test('AuthEmailService allows noop delivery in production', () => {
  const service = new AuthEmailService({
    get: (key: string, fallback?: unknown) => {
      if (key === 'email.provider') return 'noop'
      if (key === 'app.env') return 'production'
      return fallback
    },
  } as never)

  assert.ok(service)
})
