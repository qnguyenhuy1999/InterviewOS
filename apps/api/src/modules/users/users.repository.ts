import type { UpsertUserLearningProfileInput } from '@interviewos/types'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUserByEmail(email?: string) {
    if (!email) {
      throw new UnauthorizedException('Authentication required.')
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (!user) {
      throw new UnauthorizedException('User account not found.')
    }

    return user
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })
  }

  async findProfileByUserId(userId: string) {
    return this.prisma.userLearningProfile.findUnique({
      where: { userId },
    })
  }

  async updateById(userId: string, payload: { name?: string | null }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name,
      },
      include: {
        profile: true,
      },
    })
  }

  async upsertProfile(userId: string, payload: UpsertUserLearningProfileInput) {
    return this.prisma.userLearningProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...payload,
      },
      update: payload,
    })
  }
}
