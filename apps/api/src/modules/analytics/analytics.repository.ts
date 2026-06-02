import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getProgressForUser(_userId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for analytics belongs here.
    throw new NotImplementedException()
  }
}
