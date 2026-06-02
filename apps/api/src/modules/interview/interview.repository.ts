import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class InterviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSession(_payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for interview belongs here.
    throw new NotImplementedException()
  }

  findSessions() {
    void this.prisma
    // Scaffold boundary: future Prisma access for interview belongs here.
    throw new NotImplementedException()
  }

  findSessionById(_sessionId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for interview belongs here.
    throw new NotImplementedException()
  }

  updateSession(_sessionId: string, _payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for interview belongs here.
    throw new NotImplementedException()
  }

  deleteSession(_sessionId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for interview belongs here.
    throw new NotImplementedException()
  }
}
