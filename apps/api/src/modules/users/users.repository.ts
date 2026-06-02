import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(_userId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for users belongs here.
    throw new NotImplementedException()
  }

  updateById(_userId: string, _payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for users belongs here.
    throw new NotImplementedException()
  }
}
