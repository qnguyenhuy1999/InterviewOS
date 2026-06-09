import type { EnglishNoteStatus } from '@interviewos/database'
import { Injectable, NotFoundException } from '@nestjs/common'

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
    const answer = await this.prisma.interviewAnswer.findFirst({
      where: { id: payload.answerId, question: { session: { userId } } },
      select: { id: true },
    })

    if (!answer) {
      throw new NotFoundException('Answer not found.')
    }

    return this.prisma.englishNote.create({
      data: {
        userId,
        ...payload,
      },
    })
  }

  async updateStatus(userId: string, englishNoteId: string, status: EnglishNoteStatus) {
    return this.prisma.englishNote.update({
      where: {
        id: englishNoteId,
        userId,
      },
      data: {
        status,
      },
    })
  }
}
