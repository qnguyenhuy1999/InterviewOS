import { randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'

import type { LoginInput, RegisterInput } from '@interviewos/validators'
import { loginSchema, registerSchema } from '@interviewos/validators'
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthRepository } from './auth.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: Record<string, unknown>) {
    const input = loginSchema.parse(payload) satisfies LoginInput
    const user = await this.authRepository.findByEmail(input.email.toLowerCase())

    if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        jti: randomUUID(),
      }),
    }
  }

  async register(payload: Record<string, unknown>) {
    const input = registerSchema.parse(payload) satisfies RegisterInput
    const email = input.email.toLowerCase()
    const existingUser = await this.authRepository.findByEmail(email)

    if (existingUser) {
      throw new ConflictException('An account already exists for this email.')
    }

    const user = await this.authRepository.createUser({
      email,
      passwordHash: hashPassword(input.password),
      name: input.name,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        jti: randomUUID(),
      }),
    }
  }

  getSessionUser(currentUser: { sub: string; email: string; name: string | null }) {
    return {
      user: {
        id: currentUser.sub,
        email: currentUser.email,
        name: currentUser.name,
      },
    }
  }
}

function hashPassword(password: string): string {
  const salt = randomUUID()
  const derivedKey = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derivedKey}`
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, expected] = storedHash.split(':')
  if (!salt || !expected) {
    return false
  }

  const actual = scryptSync(password, salt, 64)
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'))
}
