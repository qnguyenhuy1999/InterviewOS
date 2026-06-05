import type { UpsertUserLearningProfileInput } from '@interviewos/types'
import { onboardingSchema } from '@interviewos/validators'
import { Injectable } from '@nestjs/common'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import type { UpdateMeDto, UpsertUserLearningProfileDto } from './dto/users.dto'
import { UsersRepository } from './users.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findMe(currentUser: CurrentUserRef) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return user
  }

  async updateMe(currentUser: CurrentUserRef, payload: UpdateMeDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.usersRepository.updateById(user.id, {
      name: payload.name ?? user.name,
    })
  }

  async getProfile(currentUser: CurrentUserRef) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.usersRepository.findProfileByUserId(user.id)
  }

  async upsertProfile(currentUser: CurrentUserRef, payload: UpsertUserLearningProfileDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const input = onboardingSchema.parse(payload) satisfies UpsertUserLearningProfileInput

    return this.usersRepository.upsertProfile(user.id, input)
  }
}
