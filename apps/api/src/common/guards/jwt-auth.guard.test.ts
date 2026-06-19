import assert from 'node:assert/strict'
import test from 'node:test'

import { ForbiddenException, UnauthorizedException } from '@nestjs/common'

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
        emailVerifiedAt: new Date('2026-06-19T00:00:00.000Z'),
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
    emailVerifiedAt: new Date('2026-06-19T00:00:00.000Z'),
  })
})

test('JwtAuthGuard rejects unverified users on protected routes', async () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: (_key: string) => false } as never,
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

  await assert.rejects(
    () =>
      guard.canActivate(
        createContext({
          cookies: { interviewos_session: 'opaque-token' },
          headers: {},
          ip: '127.0.0.1',
        }),
      ),
    ForbiddenException,
  )
})

test('JwtAuthGuard allows unverified users on routes opted into pre-verification access', async () => {
  const guard = new JwtAuthGuard(
    {
      getAllAndOverride: (key: string) => key === 'allowUnverifiedEmail',
    } as never,
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

  assert.equal(
    await guard.canActivate(
      createContext({
        cookies: { interviewos_session: 'opaque-token' },
        headers: {},
        ip: '127.0.0.1',
      }),
    ),
    true,
  )
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
