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
}
