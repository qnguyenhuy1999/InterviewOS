import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  createAnalysis(_payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for resume belongs here.
    throw new NotImplementedException()
  }

  findLatestAnalysis(_userId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for resume belongs here.
    throw new NotImplementedException()
  }
}
