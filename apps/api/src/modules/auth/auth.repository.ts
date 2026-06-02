import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserForLogin(_payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for auth belongs here.
    throw new NotImplementedException()
  }

  createUser(_payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for auth belongs here.
    throw new NotImplementedException()
  }
}
