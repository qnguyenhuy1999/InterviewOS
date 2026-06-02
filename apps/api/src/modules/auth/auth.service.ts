import { Injectable, NotImplementedException } from '@nestjs/common'

import { AuthRepository } from './auth.repository'

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login(_payload: Record<string, unknown>) {
    void this.authRepository
    throw new NotImplementedException()
  }

  register(_payload: Record<string, unknown>) {
    void this.authRepository
    throw new NotImplementedException()
  }
}
