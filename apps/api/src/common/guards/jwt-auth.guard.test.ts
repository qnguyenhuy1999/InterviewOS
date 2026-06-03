import assert from 'node:assert/strict'
import test from 'node:test'

import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

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

test('JwtAuthGuard bypasses public routes', () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: () => true } as never,
    new JwtService(),
    { get: () => 'unused' } as never,
  )

  assert.equal(guard.canActivate(createContext({})), true)
})

test('JwtAuthGuard reads the session cookie and attaches request.user', () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: () => false } as never,
    {
      verify: () => ({ sub: 'user-1', email: 'user@example.com', name: 'User' }),
    } as never,
    {
      get: (key: string, fallback?: string) =>
        key === 'app.authCookieName' ? 'interviewos_session' : fallback,
    } as never,
  )

  const request: Record<string, unknown> = {
    cookies: {
      interviewos_session: 'signed-token',
    },
  }

  assert.equal(guard.canActivate(createContext(request)), true)
  assert.deepEqual(request.user, {
    sub: 'user-1',
    email: 'user@example.com',
    name: 'User',
  })
})

test('JwtAuthGuard rejects missing cookies', () => {
  const guard = new JwtAuthGuard(
    { getAllAndOverride: () => false } as never,
    { verify: () => ({}) } as never,
    { get: () => 'interviewos_session' } as never,
  )

  assert.throws(() => guard.canActivate(createContext({ cookies: {} })), UnauthorizedException)
})
