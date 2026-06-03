import type { Prisma } from '@interviewos/database'
import type { RecommendationPayload } from '@interviewos/types'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class RecommendationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRecommendationsForUser(userId: string) {
    return this.prisma.learningRecommendation.findMany({
      where: {
        userId,
      },
      orderBy: [{ createdAt: 'desc' }],
    })
  }

  async getSourceContext(userId: string) {
    const [notes, weakConcepts, englishWeaknesses] = await Promise.all([
      this.prisma.technicalNote.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        include: {
          questions: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.userWeakConcept.findMany({
        where: { userId },
        orderBy: [{ occurrenceCount: 'desc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.userEnglishWeakness.findMany({
        where: { userId },
        orderBy: [{ occurrenceCount: 'desc' }, { updatedAt: 'desc' }],
      }),
    ])

    return { notes, weakConcepts, englishWeaknesses }
  }

  async replaceRecommendations(
    userId: string,
    items: Array<{ type: string; payload: RecommendationPayload }>,
  ) {
    await this.prisma.learningRecommendation.deleteMany({
      where: { userId },
    })

    if (items.length === 0) {
      return []
    }

    await this.prisma.learningRecommendation.createMany({
      data: items.map((item) => ({
        userId,
        type: item.type,
        payload: item.payload as unknown as Prisma.InputJsonValue,
      })),
    })

    return this.findRecommendationsForUser(userId)
  }
}
