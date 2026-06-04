import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  createAnalysis(
    userId: string,
    payload: {
      rawText: string
      analysisResult: Prisma.InputJsonValue
      aiMetadata: Prisma.InputJsonValue
    },
  ) {
    return this.prisma.resumeAnalysis.create({
      data: {
        userId,
        rawText: payload.rawText,
        analysisResult: payload.analysisResult,
        aiMetadata: payload.aiMetadata,
      },
    })
  }

  findLatestAnalysis(userId: string) {
    return this.prisma.resumeAnalysis.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
