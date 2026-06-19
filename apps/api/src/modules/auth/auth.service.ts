import type { ActiveAuthSession } from '@interviewos/types'
import type { LoginInput, RegisterInput } from '@interviewos/validators'
import {
  confirmEmailVerificationSchema,
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resendEmailVerificationSchema,
  resetPasswordSchema,
} from '@interviewos/validators'
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import {
  generateOpaqueToken,
  hashOpaqueToken,
  hashPasswordAsync,
  verifyPasswordAsync,
} from './auth.crypto'
import { AuthRepository } from './auth.repository'
import { AuthEmailService } from './auth-email.service'
import type {
  ConfirmEmailVerificationDto,
  LoginDto,
  RegisterDto,
  RequestPasswordResetDto,
  ResendEmailVerificationDto,
  ResetPasswordDto,
} from './dto/auth.dto'

type SessionContext = {
  userAgent?: string | null
  ipAddress?: string | null
}

const DUMMY_HASH = `00000000-0000-0000-0000-000000000000:${'00'.repeat(64)}`

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly authEmail: AuthEmailService,
  ) {}

  async login(payload: LoginDto, context: SessionContext) {
    const input = loginSchema.parse(payload) satisfies LoginInput
    const user = await this.authRepository.findByEmail(input.email.toLowerCase())

    const passwordHash = user?.passwordHash ?? DUMMY_HASH
    const passwordValid = await verifyPasswordAsync(input.password, passwordHash)
    if (!user?.passwordHash || !passwordValid) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    return this.createAuthenticatedSession(user, context)
  }

  async register(payload: RegisterDto, context: SessionContext) {
    const input = registerSchema.parse(payload) satisfies RegisterInput
    const email = input.email.toLowerCase()
    const existingUser = await this.authRepository.findByEmail(email)

    if (existingUser) {
      throw new ConflictException('An account already exists for this email.')
    }

    const user = await this.authRepository.createUser({
      email,
      passwordHash: await hashPasswordAsync(input.password),
      name: input.name,
    })

    await this.issueEmailVerification(user.id, user.email)
    return this.createAuthenticatedSession(user, context)
  }

  async authenticateSessionToken(sessionToken: string, _context: SessionContext) {
    const now = new Date()
    const session = await this.authRepository.findActiveSessionByTokenHash(
      hashOpaqueToken(sessionToken),
      now,
    )

    if (!session) {
      throw new UnauthorizedException('Session is invalid or expired.')
    }

    await this.authRepository.touchSession(session.id, now)

    return {
      id: session.user.id,
      sessionId: session.id,
      email: session.user.email,
      name: session.user.name,
      emailVerifiedAt: session.user.emailVerifiedAt,
    } satisfies AuthenticatedUser
  }

  getSessionUser(currentUser: AuthenticatedUser) {
    return {
      user: currentUser,
    }
  }

  async listSessions(currentUser: AuthenticatedUser): Promise<ActiveAuthSession[]> {
    const now = new Date()
    const sessions = await this.authRepository.listActiveSessions(currentUser.id, now)

    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      lastSeenAt: session.lastSeenAt,
      createdAt: session.createdAt,
      isCurrent: session.id === currentUser.sessionId,
    }))
  }

  async logoutCurrentSession(currentUser: AuthenticatedUser) {
    await this.authRepository.revokeSession(currentUser.id, currentUser.sessionId, new Date())
    return { success: true }
  }

  async logoutAllSessions(currentUser: AuthenticatedUser) {
    await this.authRepository.revokeAllSessions(currentUser.id, new Date())
    return { success: true }
  }

  async revokeSession(currentUser: AuthenticatedUser, sessionId: string) {
    const revoked = await this.authRepository.revokeSession(currentUser.id, sessionId, new Date())

    if (revoked !== 1) {
      throw new NotFoundException('Session not found.')
    }

    return { success: true }
  }

  async requestPasswordReset(payload: RequestPasswordResetDto) {
    const input = requestPasswordResetSchema.parse(payload)
    const user = await this.authRepository.findByEmail(input.email.toLowerCase())

    if (user?.passwordHash) {
      await this.issuePasswordReset(user.id, user.email)
    }

    return {
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    const input = resetPasswordSchema.parse(payload)
    const token = await this.authRepository.findPasswordResetTokenByHash(
      hashOpaqueToken(input.token),
    )
    const now = new Date()

    if (!token || token.usedAt || token.expiresAt <= now) {
      throw new BadRequestException('Password reset token is invalid or expired.')
    }

    const result = await this.authRepository.resetPasswordAndRevokeSessions({
      userId: token.userId,
      passwordHash: await hashPasswordAsync(input.password),
      resetTokenId: token.id,
      now,
    })

    if (!result.success) {
      throw new BadRequestException('Password reset token is invalid or expired.')
    }

    return { success: true }
  }

  async resendEmailVerification(payload: ResendEmailVerificationDto) {
    const input = resendEmailVerificationSchema.parse(payload)
    const user = await this.authRepository.findByEmail(input.email.toLowerCase())

    if (user && !user.emailVerifiedAt) {
      await this.issueEmailVerification(user.id, user.email)
    }

    return { success: true }
  }

  async confirmEmailVerification(payload: ConfirmEmailVerificationDto) {
    const input = confirmEmailVerificationSchema.parse(payload)
    const token = await this.authRepository.findEmailVerificationTokenByHash(
      hashOpaqueToken(input.token),
    )
    const now = new Date()

    if (!token || token.usedAt || token.expiresAt <= now) {
      throw new BadRequestException('Email verification token is invalid or expired.')
    }

    const result = await this.authRepository.markEmailVerified({
      userId: token.userId,
      verificationTokenId: token.id,
      now,
    })

    if (!result.success) {
      throw new BadRequestException('Email verification token is invalid or expired.')
    }

    return { success: true }
  }

  private async createAuthenticatedSession(
    user: {
      id: string
      email: string
      name: string | null
      emailVerifiedAt: Date | null
    },
    context: SessionContext,
  ) {
    const sessionToken = generateOpaqueToken()
    const session = await this.authRepository.createSession({
      userId: user.id,
      tokenHash: hashOpaqueToken(sessionToken),
      expiresAt: new Date(Date.now() + this.sessionTtlDays() * 24 * 60 * 60 * 1000),
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    })

    return {
      user: {
        id: user.id,
        sessionId: session.id,
        email: user.email,
        name: user.name,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      sessionToken,
    }
  }

  private async issuePasswordReset(userId: string, email: string) {
    const rawToken = generateOpaqueToken()
    await this.authRepository.createPasswordResetToken({
      userId,
      tokenHash: hashOpaqueToken(rawToken),
      expiresAt: new Date(Date.now() + this.passwordResetTtlMinutes() * 60 * 1000),
    })

    await this.authEmail.sendPasswordResetEmail({
      email,
      link: `${this.webAppUrl()}/reset-password?token=${rawToken}`,
    })
  }

  private async issueEmailVerification(userId: string, email: string) {
    const rawToken = generateOpaqueToken()
    await this.authRepository.createEmailVerificationToken({
      userId,
      tokenHash: hashOpaqueToken(rawToken),
      expiresAt: new Date(Date.now() + this.emailVerificationTtlHours() * 60 * 60 * 1000),
    })

    await this.authEmail.sendVerificationEmail({
      email,
      link: `${this.webAppUrl()}/verify-email?token=${rawToken}`,
    })
  }

  private sessionTtlDays() {
    return this.configService.get<number>('app.authSessionTtlDays', 7)
  }

  private passwordResetTtlMinutes() {
    return this.configService.get<number>('app.passwordResetTtlMinutes', 30)
  }

  private emailVerificationTtlHours() {
    return this.configService.get<number>('app.emailVerificationTtlHours', 24)
  }

  private webAppUrl() {
    return this.configService.get<string>('app.webAppUrl', 'http://localhost:3000')
  }
}
