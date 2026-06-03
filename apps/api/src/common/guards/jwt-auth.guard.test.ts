import assert from 'node:assert/strict'
import test from 'node:test'

import { UnauthorizedException } from '@nestjs/common'

import { JwtAuthGuard } from './jwt-auth.guard'

function createContext(request: Record<string, unknown>) {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as never
}

test('JwtAuthGuard bypasses public routes', async () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: () => true } as never,
    { authenticateSessionToken: async () => undefined } as never,
    { get: () => 'unused' } as never,
  )

  assert.equal(await guard.canActivate(createContext({})), true)
})

test('JwtAuthGuard reads the session cookie and attaches request.user', async () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: () => false } as never,
    {
      authenticateSessionToken: async () => ({
        id: 'user-1',
        sessionId: 'session-1',
        email: 'user@example.com',
        name: 'User',
        emailVerifiedAt: null,
      }),
    } as never,
    {
      get: (key: string, fallback?: string) =>
        key === 'app.authCookieName' ? 'interviewos_session' : fallback,
    } as never,
  )

  const request: Record<string, unknown> = {
    cookies: {
      interviewos_session: 'opaque-token',
    },
    headers: {},
    ip: '127.0.0.1',
  }

  assert.equal(await guard.canActivate(createContext(request)), true)
  assert.deepEqual(request.user, {
    id: 'user-1',
    sessionId: 'session-1',
    email: 'user@example.com',
    name: 'User',
    emailVerifiedAt: null,
  })
})

test('JwtAuthGuard rejects missing cookies', async () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: () => false } as never,
    { authenticateSessionToken: async () => undefined } as never,
    { get: () => 'interviewos_session' } as never,
  )

  await assert.rejects(
    () => guard.canActivate(createContext({ cookies: {}, headers: {}, ip: '127.0.0.1' })),
    UnauthorizedException,
  )
})
