import assert from 'node:assert/strict'
import test from 'node:test'

import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common'

import { hashOpaqueToken, hashPassword } from './auth.crypto'
import { AuthService } from './auth.service'

type UserRecord = {
  id: string
  email: string
  passwordHash: string | null
  name: string | null
  emailVerifiedAt: Date | null
}

type SessionRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  revokedAt: Date | null
  lastSeenAt: Date | null
  userAgent: string | null
  ipAddress: string | null
  createdAt: Date
}

type ResetTokenRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null
}

type VerificationTokenRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null
}

function createHarness() {
  const users = new Map<string, UserRecord>()
  const sessions = new Map<string, SessionRecord>()
  const resetTokens = new Map<string, ResetTokenRecord>()
  const verificationTokens = new Map<string, VerificationTokenRecord>()
  const logs: string[] = []
  let sequence = 0

  const repository = {
    async findByEmail(email: string) {
      return Array.from(users.values()).find((user) => user.email === email) ?? null
    },
    async createUser(payload: { email: string; passwordHash: string; name?: string }) {
      const user: UserRecord = {
        id: `user-${++sequence}`,
        email: payload.email,
        passwordHash: payload.passwordHash,
        name: payload.name ?? null,
        emailVerifiedAt: null,
      }
      users.set(user.id, user)
      return user
    },
    async createSession(payload: {
      userId: string
      tokenHash: string
      expiresAt: Date
      userAgent?: string | null
      ipAddress?: string | null
    }) {
      const session: SessionRecord = {
        id: `session-${++sequence}`,
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
        revokedAt: null,
        lastSeenAt: new Date(),
        userAgent: payload.userAgent ?? null,
        ipAddress: payload.ipAddress ?? null,
        createdAt: new Date(),
      }
      sessions.set(session.id, session)
      return session
    },
    async findActiveSessionByTokenHash(tokenHash: string, now: Date) {
      const session = Array.from(sessions.values()).find(
        (item) => item.tokenHash === tokenHash && item.revokedAt === null && item.expiresAt > now,
      )
      if (!session) {
        return null
      }
      const user = users.get(session.userId)
      return user ? { ...session, user } : null
    },
    async touchSession(sessionId: string, now: Date) {
      const session = sessions.get(sessionId)
      if (session) {
        session.lastSeenAt = now
      }
      return session
    },
    async listActiveSessions(userId: string, now: Date) {
      return Array.from(sessions.values()).filter(
        (session) => session.userId === userId && session.revokedAt === null && session.expiresAt > now,
      )
    },
    async revokeSession(userId: string, sessionId: string, revokedAt: Date) {
      const session = sessions.get(sessionId)
      if (!session || session.userId !== userId || session.revokedAt) {
        return 0
      }
      session.revokedAt = revokedAt
      return 1
    },
    async revokeAllSessions(userId: string, revokedAt: Date) {
      let count = 0
      for (const session of sessions.values()) {
        if (session.userId === userId && session.revokedAt === null) {
          session.revokedAt = revokedAt
          count += 1
        }
      }
      return { count }
    },
    async createPasswordResetToken(payload: {
      userId: string
      tokenHash: string
      expiresAt: Date
    }) {
      for (const [id, token] of resetTokens.entries()) {
        if (token.userId === payload.userId && token.usedAt === null) {
          resetTokens.delete(id)
        }
      }
      const record: ResetTokenRecord = {
        id: `reset-${++sequence}`,
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
        usedAt: null,
      }
      resetTokens.set(record.id, record)
      return record
    },
    async findPasswordResetTokenByHash(tokenHash: string) {
      const token = Array.from(resetTokens.values()).find((item) => item.tokenHash === tokenHash)
      if (!token) {
        return null
      }
      const user = users.get(token.userId)
      return user ? { ...token, user } : null
    },
    async resetPasswordAndRevokeSessions(payload: {
      userId: string
      passwordHash: string
      resetTokenId: string
      now: Date
    }) {
      const token = resetTokens.get(payload.resetTokenId)
      if (!token || token.usedAt || token.expiresAt <= payload.now) {
        return { success: false as const }
      }
      token.usedAt = payload.now
      const user = users.get(payload.userId)
      if (user) {
        user.passwordHash = payload.passwordHash
      }
      for (const session of sessions.values()) {
        if (session.userId === payload.userId && session.revokedAt === null) {
          session.revokedAt = payload.now
        }
      }
      for (const [id, record] of resetTokens.entries()) {
        if (record.userId === payload.userId && id !== payload.resetTokenId) {
          resetTokens.delete(id)
        }
      }
      return { success: true as const }
    },
    async createEmailVerificationToken(payload: {
      userId: string
      tokenHash: string
      expiresAt: Date
    }) {
      for (const [id, token] of verificationTokens.entries()) {
        if (token.userId === payload.userId && token.usedAt === null) {
          verificationTokens.delete(id)
        }
      }
      const record: VerificationTokenRecord = {
        id: `verify-${++sequence}`,
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
        usedAt: null,
      }
      verificationTokens.set(record.id, record)
      return record
    },
    async findEmailVerificationTokenByHash(tokenHash: string) {
      const token = Array.from(verificationTokens.values()).find(
        (item) => item.tokenHash === tokenHash,
      )
      if (!token) {
        return null
      }
      const user = users.get(token.userId)
      return user ? { ...token, user } : null
    },
    async markEmailVerified(payload: {
      userId: string
      verificationTokenId: string
      now: Date
    }) {
      const token = verificationTokens.get(payload.verificationTokenId)
      if (!token || token.usedAt || token.expiresAt <= payload.now) {
        return { success: false as const }
      }
      token.usedAt = payload.now
      const user = users.get(payload.userId)
      if (user) {
        user.emailVerifiedAt = payload.now
      }
      for (const [id, record] of verificationTokens.entries()) {
        if (record.userId === payload.userId && id !== payload.verificationTokenId) {
          verificationTokens.delete(id)
        }
      }
      return { success: true as const }
    },
  }

  const service = new AuthService(
    repository as never,
    {
      get: (key: string, fallback?: unknown) => {
        if (key === 'app.authSessionTtlDays') {
          return 7
        }
        if (key === 'app.passwordResetTtlMinutes') {
          return 30
        }
        if (key === 'app.emailVerificationTtlHours') {
          return 24
        }
        if (key === 'app.webAppUrl') {
          return 'http://localhost:3000'
        }
        return fallback
      },
    } as never,
    {
      sendPasswordResetEmail: async ({ link }: { link: string }) => {
        logs.push(link)
      },
      sendVerificationEmail: async ({ link }: { link: string }) => {
        logs.push(link)
      },
    } as never,
  )

  function seedUser(input: Partial<UserRecord> & { email: string; password?: string }) {
    const user: UserRecord = {
      id: input.id ?? `user-${++sequence}`,
      email: input.email.toLowerCase(),
      passwordHash: input.password ? hashPassword(input.password) : (input.passwordHash ?? null),
      name: input.name ?? null,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
    }
    users.set(user.id, user)
    return user
  }

  return {
    service,
    seedUser,
    users,
    sessions,
    resetTokens,
    verificationTokens,
    logs,
  }
}

function lastTokenFromLog(logs: string[]) {
  const lastLog = logs.at(-1) ?? ''
  const match = lastLog.match(/token=([a-f0-9]+)/)
  return match?.[1]
}

test('AuthService creates hashed sessions and enforces expiration and revocation', async () => {
  const harness = createHarness()
  const user = harness.seedUser({ email: 'user@example.com', password: 'password123' })

  const login = await harness.service.login(
    { email: user.email, password: 'password123' },
    { userAgent: 'Chrome', ipAddress: '127.0.0.1' },
  )

  const session = Array.from(harness.sessions.values())[0]
  assert.ok(session)
  assert.notEqual(session.tokenHash, login.sessionToken)
  assert.equal(session.tokenHash, hashOpaqueToken(login.sessionToken))

  const authenticated = await harness.service.authenticateSessionToken(login.sessionToken, {})
  assert.equal(authenticated.id, user.id)
  assert.equal(authenticated.sessionId, session.id)

  session.expiresAt = new Date(Date.now() - 1_000)
  await assert.rejects(
    () => harness.service.authenticateSessionToken(login.sessionToken, {}),
    UnauthorizedException,
  )

  const secondLogin = await harness.service.login(
    { email: user.email, password: 'password123' },
    { userAgent: 'Firefox', ipAddress: '127.0.0.2' },
  )
  const currentUser = await harness.service.authenticateSessionToken(secondLogin.sessionToken, {})
  await harness.service.logoutCurrentSession(currentUser)

  await assert.rejects(
    () => harness.service.authenticateSessionToken(secondLogin.sessionToken, {}),
    UnauthorizedException,
  )
})

test('AuthService supports logout all and blocks revocation of another user session', async () => {
  const harness = createHarness()
  const userOne = harness.seedUser({ email: 'one@example.com', password: 'password123' })
  const userTwo = harness.seedUser({ email: 'two@example.com', password: 'password123' })

  const oneA = await harness.service.login({ email: userOne.email, password: 'password123' }, {})
  const oneB = await harness.service.login({ email: userOne.email, password: 'password123' }, {})
  const twoA = await harness.service.login({ email: userTwo.email, password: 'password123' }, {})

  const currentUser = await harness.service.authenticateSessionToken(oneA.sessionToken, {})
  const otherUser = await harness.service.authenticateSessionToken(twoA.sessionToken, {})

  await assert.rejects(
    () => harness.service.revokeSession(currentUser, otherUser.sessionId),
    NotFoundException,
  )

  await harness.service.logoutAllSessions(currentUser)

  await assert.rejects(
    () => harness.service.authenticateSessionToken(oneA.sessionToken, {}),
    UnauthorizedException,
  )
  await assert.rejects(
    () => harness.service.authenticateSessionToken(oneB.sessionToken, {}),
    UnauthorizedException,
  )

  const stillValid = await harness.service.authenticateSessionToken(twoA.sessionToken, {})
  assert.equal(stillValid.id, userTwo.id)
})

test('AuthService hashes password reset tokens, enforces single-use, expiry, and revokes sessions', async () => {
  const harness = createHarness()
  const user = harness.seedUser({ email: 'reset@example.com', password: 'password123' })

  const activeLogin = await harness.service.login({ email: user.email, password: 'password123' }, {})
  await harness.service.requestPasswordReset({ email: user.email })
  const rawToken = lastTokenFromLog(harness.logs)
  const storedToken = Array.from(harness.resetTokens.values())[0]

  assert.ok(rawToken)
  assert.ok(storedToken)
  assert.notEqual(storedToken.tokenHash, rawToken)
  assert.equal(storedToken.tokenHash, hashOpaqueToken(rawToken))

  await harness.service.resetPassword({ token: rawToken, password: 'newpassword123' })

  await assert.rejects(
    () => harness.service.authenticateSessionToken(activeLogin.sessionToken, {}),
    UnauthorizedException,
  )
  await assert.rejects(
    () => harness.service.resetPassword({ token: rawToken, password: 'newpassword123' }),
    BadRequestException,
  )

  await harness.service.requestPasswordReset({ email: user.email })
  const expiringToken = Array.from(harness.resetTokens.values()).at(-1)!
  expiringToken.expiresAt = new Date(Date.now() - 1_000)

  await assert.rejects(
    () => harness.service.resetPassword({ token: lastTokenFromLog(harness.logs)!, password: 'anotherpass123' }),
    BadRequestException,
  )
})

test('AuthService hashes email verification tokens and enforces single-use and expiry', async () => {
  const harness = createHarness()
  const user = harness.seedUser({ email: 'verify@example.com', password: 'password123' })

  await harness.service.resendEmailVerification({ email: user.email })
  const rawToken = lastTokenFromLog(harness.logs)
  const storedToken = Array.from(harness.verificationTokens.values())[0]

  assert.ok(rawToken)
  assert.ok(storedToken)
  assert.notEqual(storedToken.tokenHash, rawToken)
  assert.equal(storedToken.tokenHash, hashOpaqueToken(rawToken))

  await harness.service.confirmEmailVerification({ token: rawToken })
  assert.ok(harness.users.get(user.id)?.emailVerifiedAt)

  await assert.rejects(
    () => harness.service.confirmEmailVerification({ token: rawToken }),
    BadRequestException,
  )

  harness.users.get(user.id)!.emailVerifiedAt = null
  await harness.service.resendEmailVerification({ email: user.email })
  const expiringToken = Array.from(harness.verificationTokens.values()).at(-1)!
  expiringToken.expiresAt = new Date(Date.now() - 1_000)

  await assert.rejects(
    () =>
      harness.service.confirmEmailVerification({
        token: lastTokenFromLog(harness.logs)!,
      }),
    BadRequestException,
  )
})
