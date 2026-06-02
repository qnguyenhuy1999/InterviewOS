import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class RecommendationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRecommendationsForUser(_userId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for recommendations belongs here.
    throw new NotImplementedException()
  }
}
