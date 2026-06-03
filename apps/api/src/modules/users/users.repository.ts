import type { UpsertUserLearningProfileInput } from '@interviewos/types'
import { Injectable } from '@nestjs/common'

import { DEMO_USER_EMAIL, DEMO_USER_NAME } from '../../common/constants/demo-user'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUserByEmail(email = DEMO_USER_EMAIL) {
    return this.prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: DEMO_USER_NAME,
      },
      include: {
        profile: true,
      },
    })
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
