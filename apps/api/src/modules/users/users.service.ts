import { Injectable, NotImplementedException } from '@nestjs/common'

import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findMe(_currentUser: unknown) {
    void this.usersRepository
    throw new NotImplementedException()
  }

  updateMe(_currentUser: unknown, _payload: Record<string, unknown>) {
    void this.usersRepository
    throw new NotImplementedException()
  }
}
