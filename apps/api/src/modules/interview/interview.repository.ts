import type { Prisma } from '@interviewos/database'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class InterviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSessionFromGeneratedQuestion(
    userId: string,
    source: {
      noteId: string
      generatedQuestionId: string
      question: string
      difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
      category: string
      expectedConcepts: string[]
      sourceSection: string
    },
  ) {
    return this.prisma.interviewSession.create({
      data: {
        userId,
        type: 'TECHNICAL',
        status: 'DRAFT',
        noteId: source.noteId,
        sourceQuestionId: source.generatedQuestionId,
        startedAt: new Date(),
        questions: {
          create: {
            order: 0,
            question: source.question,
            difficulty: source.difficulty,
            category: source.category,
            expectedConcepts: source.expectedConcepts,
            sourceSection: source.sourceSection,
            topicTags: source.expectedConcepts,
          },
        },
      },
      include: {
        questions: {
          include: {
            answer: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })
  }

  async findSessions(userId: string) {
    return this.prisma.interviewSession.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        questions: {
          include: {
            answer: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        note: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findSessionById(userId: string, sessionId: string) {
    return this.prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
        deletedAt: null,
      },
      include: {
        questions: {
          include: {
            answer: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        note: {
          include: {
            questions: true,
          },
        },
      },
    })
  }

  async saveAnswer(
    sessionId: string,
    questionId: string,
    payload: {
      rawAnswer: string
      technicalScore: number
      englishScore: number
      clarityScore: number
      overallScore: number
      aiFeedback: string
      technicalFeedback: Prisma.JsonObject
      englishFeedback: Prisma.JsonObject
      nextRecommendedQuestion: Prisma.JsonObject
      recommendedLearning: Prisma.JsonObject
      weakConcepts: string[]
    },
  ) {
    return this.prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: 'PUBLISHED',
        endedAt: new Date(),
        questions: {
          update: {
            where: { id: questionId },
            data: {
              answer: {
                upsert: {
                  create: payload,
                  update: payload,
                },
              },
            },
          },
        },
      },
      include: {
        questions: {
          include: {
            answer: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        note: {
          include: {
            questions: true,
          },
        },
      },
    })
  }

  async saveEnglishNotes(
    userId: string,
    answerId: string,
    notes: Array<{
      userSentence: string
      correctedSentence: string
      naturalVersion: string
      explanation: string
      grammarTopic: string
      recommendedTopics: string[]
      practicePatterns: string[]
    }>,
  ) {
    if (notes.length === 0) {
      return []
    }

    await this.prisma.englishNote.createMany({
      data: notes.map((note) => ({
        userId,
        answerId,
        originalSentence: note.userSentence,
        correctedSentence: note.correctedSentence,
        naturalVersion: note.naturalVersion,
        explanation: note.explanation,
        grammarTopic: note.grammarTopic,
        recommendedStudyTopics: note.recommendedTopics,
        practicePatterns: note.practicePatterns,
      })),
    })

    return this.prisma.englishNote.findMany({
      where: {
        userId,
        answerId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }

  async upsertWeakConcepts(userId: string, answerId: string, concepts: string[]) {
    await Promise.all(
      concepts.map(async (concept) => {
        const existing = await this.prisma.userWeakConcept.findFirst({
          where: {
            userId,
            concept,
          },
        })

        if (!existing) {
          await this.prisma.userWeakConcept.create({
            data: {
              userId,
              concept,
              lastSeenAt: new Date(),
              sourceAnswerIds: [answerId],
            },
          })
          return
        }

        const sourceAnswerIds = Array.from(new Set([...existing.sourceAnswerIds, answerId]))
        await this.prisma.userWeakConcept.update({
          where: { id: existing.id },
          data: {
            occurrenceCount: existing.occurrenceCount + 1,
            lastSeenAt: new Date(),
            sourceAnswerIds,
          },
        })
      }),
    )
  }

  async upsertEnglishWeaknesses(userId: string, answerId: string, topics: string[]) {
    await Promise.all(
      topics.map(async (topic) => {
        const existing = await this.prisma.userEnglishWeakness.findFirst({
          where: {
            userId,
            topic,
          },
        })

        if (!existing) {
          await this.prisma.userEnglishWeakness.create({
            data: {
              userId,
              topic,
              lastSeenAt: new Date(),
              sourceAnswerIds: [answerId],
            },
          })
          return
        }

        const sourceAnswerIds = Array.from(new Set([...existing.sourceAnswerIds, answerId]))
        await this.prisma.userEnglishWeakness.update({
          where: { id: existing.id },
          data: {
            occurrenceCount: existing.occurrenceCount + 1,
            lastSeenAt: new Date(),
            sourceAnswerIds,
          },
        })
      }),
    )
  }

  async deleteSession(userId: string, sessionId: string) {
    return this.prisma.interviewSession.update({
      where: { id: sessionId, userId },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
