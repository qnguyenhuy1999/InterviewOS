import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

test('AuthController throttles email verification confirmation', () => {
  const controllerPath = path.resolve(process.cwd(), 'apps/api/src/modules/auth/auth.controller.ts')
  const source = readFileSync(controllerPath, 'utf8')

  assert.match(
    source,
    /@Public\(\)\s+@AuthThrottle\(\)\s+@Post\('email-verification\/confirm'\)/,
  )
})

test('AuthController allows unverified users to access account recovery auth routes', () => {
  const controllerPath = path.resolve(process.cwd(), 'apps/api/src/modules/auth/auth.controller.ts')
  const source = readFileSync(controllerPath, 'utf8')

  assert.match(source, /@Post\('logout'\)\s+@AllowUnverifiedEmail\(\)/)
  assert.match(source, /@Get\('me'\)\s+@AllowUnverifiedEmail\(\)/)
})
