import { Prisma } from '@interviewos/database'
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
        overrideStack: [],
        overrideGoals: [],
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
      overrideRole: string | null
      overrideLevel: string
      overrideStack: string[]
      overrideGoals: string[]
      overrideEnglishLevel: string
      preferredOutputStyle: string | null
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
      aiMetadata: Prisma.InputJsonValue
    },
  ) {
    return this.prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: 'PUBLISHED',
        endedAt: new Date(),
        overrideRole: payload.overrideRole,
        overrideLevel: payload.overrideLevel as never,
        overrideStack: payload.overrideStack,
        overrideGoals: payload.overrideGoals,
        overrideEnglishLevel: payload.overrideEnglishLevel as never,
        preferredOutputStyle: payload.preferredOutputStyle,
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
    aiMetadata: Prisma.InputJsonValue,
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
        aiMetadata,
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

    const findMany = this.prisma.userWeakConcept.findMany?.bind(this.prisma.userWeakConcept)
    if (!findMany) {
      return []
    }

    return findMany({
      where: {
        userId,
        concept: {
          in: concepts,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
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
      data: { deletedAt: new Date() },
    })
  }

  async createMultiTurnSession(
    userId: string,
    input: {
      type: string
      mode: string
      companyModeId: string | null
      maxTurns: number
      overrideRole: string | null
      overrideLevel: string
      overrideStack: string[]
    },
  ) {
    return this.prisma.interviewSession.create({
      data: {
        userId,
        type: input.type as never,
        mode: input.mode as never,
        status: 'DRAFT',
        companyModeId: input.companyModeId,
        maxTurns: input.maxTurns,
        overrideRole: input.overrideRole,
        overrideLevel: input.overrideLevel as never,
        overrideStack: input.overrideStack,
        overrideGoals: [],
        startedAt: new Date(),
      },
      include: { companyMode: true, turns: true },
    })
  }

  async createInterviewTurn(data: {
    sessionId: string
    turnNumber: number
    role: string
    content: string
    decision?: string
    topicTags: string[]
    aiMetadata: Prisma.InputJsonValue | null
  }) {
    return this.prisma.interviewTurn.create({
      data: {
        sessionId: data.sessionId,
        turnNumber: data.turnNumber,
        role: data.role as never,
        content: data.content,
        decision: (data.decision ?? null) as never,
        topicTags: data.topicTags,
        aiMetadata: (data.aiMetadata ?? null) as never,
      },
    })
  }

  async findTurnsBySession(sessionId: string) {
    return this.prisma.interviewTurn.findMany({
      where: { sessionId },
      orderBy: { turnNumber: 'asc' },
    })
  }

  async incrementCurrentTurnNum(sessionId: string, currentTurnNum: number) {
    return this.prisma.interviewSession.update({
      where: { id: sessionId },
      data: { currentTurnNum },
    })
  }

  async endMultiTurnSession(sessionId: string) {
    return this.prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'PUBLISHED', endedAt: new Date() },
      include: { turns: { orderBy: { turnNumber: 'asc' } }, companyMode: true },
    })
  }

  async findCompanyModeBySlug(slug: string) {
    return this.prisma.companyMode.findUnique({ where: { slug, isActive: true } })
  }
}
