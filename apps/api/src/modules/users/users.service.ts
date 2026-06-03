import type { UpsertUserLearningProfileInput } from '@interviewos/types'
import { onboardingSchema } from '@interviewos/validators'
import { Injectable } from '@nestjs/common'

import { UsersRepository } from './users.repository'

type CurrentUserLike = {
  email?: string
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findMe(currentUser: unknown) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
    return user
  }

  async updateMe(currentUser: unknown, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
    return this.usersRepository.updateById(user.id, {
      name: typeof payload.name === 'string' ? payload.name : user.name,
    })
  }

  async getProfile(currentUser: unknown) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
    return this.usersRepository.findProfileByUserId(user.id)
  }

  async upsertProfile(currentUser: unknown, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
    const input = onboardingSchema.parse(payload) satisfies UpsertUserLearningProfileInput

    return this.usersRepository.upsertProfile(user.id, input)
  }

  private resolveEmail(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.email
  }
}
