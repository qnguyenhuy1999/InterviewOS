import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
  }

  createUser(payload: { email: string; passwordHash: string; name?: string }) {
    return this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash: payload.passwordHash,
        name: payload.name ?? null,
      },
      include: { profile: true },
    })
  }

  createSession(payload: {
    userId: string
    tokenHash: string
    expiresAt: Date
    userAgent?: string | null
    ipAddress?: string | null
  }) {
    return this.prisma.authSession.create({
      data: {
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
        userAgent: payload.userAgent ?? null,
        ipAddress: payload.ipAddress ?? null,
        lastSeenAt: new Date(),
      },
    })
  }

  findActiveSessionByTokenHash(tokenHash: string, now: Date) {
    return this.prisma.authSession.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      include: {
        user: true,
      },
    })
  }

  touchSession(sessionId: string, now: Date) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: {
        lastSeenAt: now,
      },
    })
  }

  listActiveSessions(userId: string, now: Date) {
    return this.prisma.authSession.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async revokeSession(userId: string, sessionId: string, revokedAt: Date) {
    const result = await this.prisma.authSession.updateMany({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt,
      },
    })

    return result.count
  }

  revokeAllSessions(userId: string, revokedAt: Date) {
    return this.prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt,
      },
    })
  }

  createPasswordResetToken(payload: {
    userId: string
    tokenHash: string
    expiresAt: Date
  }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: {
          userId: payload.userId,
          usedAt: null,
        },
      })

      return tx.passwordResetToken.create({
        data: payload,
      })
    })
  }

  findPasswordResetTokenByHash(tokenHash: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: {
        user: true,
      },
    })
  }

  usePasswordResetToken(tokenId: string, now: Date) {
    return this.prisma.passwordResetToken.updateMany({
      where: {
        id: tokenId,
        usedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        usedAt: now,
      },
    })
  }

  async resetPasswordAndRevokeSessions(payload: {
    userId: string
    passwordHash: string
    resetTokenId: string
    now: Date
  }) {
    return this.prisma.$transaction(async (tx) => {
      const tokenResult = await tx.passwordResetToken.updateMany({
        where: {
          id: payload.resetTokenId,
          usedAt: null,
          expiresAt: {
            gt: payload.now,
          },
        },
        data: {
          usedAt: payload.now,
        },
      })

      if (tokenResult.count !== 1) {
        return { success: false as const }
      }

      await tx.user.update({
        where: { id: payload.userId },
        data: {
          passwordHash: payload.passwordHash,
        },
      })

      await tx.authSession.updateMany({
        where: {
          userId: payload.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: payload.now,
        },
      })

      await tx.passwordResetToken.deleteMany({
        where: {
          userId: payload.userId,
          id: {
            not: payload.resetTokenId,
          },
        },
      })

      return { success: true as const }
    })
  }

  createEmailVerificationToken(payload: {
    userId: string
    tokenHash: string
    expiresAt: Date
  }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.deleteMany({
        where: {
          userId: payload.userId,
          usedAt: null,
        },
      })

      return tx.emailVerificationToken.create({
        data: payload,
      })
    })
  }

  findEmailVerificationTokenByHash(tokenHash: string) {
    return this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: {
        user: true,
      },
    })
  }

  async markEmailVerified(payload: {
    userId: string
    verificationTokenId: string
    now: Date
  }) {
    return this.prisma.$transaction(async (tx) => {
      const tokenResult = await tx.emailVerificationToken.updateMany({
        where: {
          id: payload.verificationTokenId,
          usedAt: null,
          expiresAt: {
            gt: payload.now,
          },
        },
        data: {
          usedAt: payload.now,
        },
      })

      if (tokenResult.count !== 1) {
        return { success: false as const }
      }

      await tx.user.update({
        where: { id: payload.userId },
        data: {
          emailVerifiedAt: payload.now,
        },
      })

      await tx.emailVerificationToken.deleteMany({
        where: {
          userId: payload.userId,
          id: {
            not: payload.verificationTokenId,
          },
        },
      })

      return { success: true as const }
    })
  }
}
