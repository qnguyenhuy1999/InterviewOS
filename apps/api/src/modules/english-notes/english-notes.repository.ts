import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class EnglishNotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findEnglishNotes(userId: string) {
    return this.prisma.englishNote.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async createEnglishNote(
    userId: string,
    payload: {
      answerId: string
      originalSentence: string
      correctedSentence: string
      naturalVersion: string
      explanation: string
      grammarTopic: string
      recommendedStudyTopics: string[]
      practicePatterns: string[]
    },
  ) {
    return this.prisma.englishNote.create({
      data: {
        userId,
        ...payload,
      },
    })
  }
}
