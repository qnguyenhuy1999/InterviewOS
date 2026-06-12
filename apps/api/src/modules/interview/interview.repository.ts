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
        status: 'PENDING' as never,
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
        companyMode: true,
        evaluation: true,
        summary: true,
        readinessImpact: true,
      },
      orderBy: {
        lastActivityAt: 'desc',
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
        companyMode: true,
        evaluation: true,
        summary: true,
        readinessImpact: true,
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
        status: 'COMPLETED' as never,
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
                  create: {
                    rawAnswer: payload.rawAnswer,
                    technicalScore: payload.technicalScore,
                    englishScore: payload.englishScore,
                    clarityScore: payload.clarityScore,
                    overallScore: payload.overallScore,
                    aiFeedback: payload.aiFeedback,
                    technicalFeedback: payload.technicalFeedback,
                    englishFeedback: payload.englishFeedback,
                    nextRecommendedQuestion: payload.nextRecommendedQuestion,
                    recommendedLearning: payload.recommendedLearning,
                    weakConcepts: payload.weakConcepts,
                    aiMetadata: payload.aiMetadata,
                  },
                  update: {
                    rawAnswer: payload.rawAnswer,
                    technicalScore: payload.technicalScore,
                    englishScore: payload.englishScore,
                    clarityScore: payload.clarityScore,
                    overallScore: payload.overallScore,
                    aiFeedback: payload.aiFeedback,
                    technicalFeedback: payload.technicalFeedback,
                    englishFeedback: payload.englishFeedback,
                    nextRecommendedQuestion: payload.nextRecommendedQuestion,
                    recommendedLearning: payload.recommendedLearning,
                    weakConcepts: payload.weakConcepts,
                    aiMetadata: payload.aiMetadata,
                  },
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

  async saveAnswerAtomic(params: {
    sessionId: string
    questionId: string
    userId: string
    answerPayload: {
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
    }
    usefulEnglishNotes: Array<{
      userSentence: string
      correctedSentence: string
      naturalVersion: string
      explanation: string
      grammarTopic: string
      recommendedTopics: string[]
      practicePatterns: string[]
    }>
    weakConceptNames: string[]
    englishWeakTopics: string[]
    englishAiMetadata: Prisma.InputJsonValue
  }) {
    return this.prisma.$transaction(async (tx) => {
      const { sessionId, questionId, userId, answerPayload } = params

      const session = await tx.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED' as never,
          endedAt: new Date(),
          overrideRole: answerPayload.overrideRole,
          overrideLevel: answerPayload.overrideLevel as never,
          overrideStack: answerPayload.overrideStack,
          overrideGoals: answerPayload.overrideGoals,
          overrideEnglishLevel: answerPayload.overrideEnglishLevel as never,
          preferredOutputStyle: answerPayload.preferredOutputStyle,
          questions: {
            update: {
              where: { id: questionId },
              data: {
                answer: {
                  upsert: {
                    create: {
                      rawAnswer: answerPayload.rawAnswer,
                      technicalScore: answerPayload.technicalScore,
                      englishScore: answerPayload.englishScore,
                      clarityScore: answerPayload.clarityScore,
                      overallScore: answerPayload.overallScore,
                      aiFeedback: answerPayload.aiFeedback,
                      technicalFeedback: answerPayload.technicalFeedback,
                      englishFeedback: answerPayload.englishFeedback,
                      nextRecommendedQuestion: answerPayload.nextRecommendedQuestion,
                      recommendedLearning: answerPayload.recommendedLearning,
                      weakConcepts: answerPayload.weakConcepts,
                      aiMetadata: answerPayload.aiMetadata,
                    },
                    update: {
                      rawAnswer: answerPayload.rawAnswer,
                      technicalScore: answerPayload.technicalScore,
                      englishScore: answerPayload.englishScore,
                      clarityScore: answerPayload.clarityScore,
                      overallScore: answerPayload.overallScore,
                      aiFeedback: answerPayload.aiFeedback,
                      technicalFeedback: answerPayload.technicalFeedback,
                      englishFeedback: answerPayload.englishFeedback,
                      nextRecommendedQuestion: answerPayload.nextRecommendedQuestion,
                      recommendedLearning: answerPayload.recommendedLearning,
                      weakConcepts: answerPayload.weakConcepts,
                      aiMetadata: answerPayload.aiMetadata,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          questions: {
            include: { answer: true },
            orderBy: { order: 'asc' },
          },
          note: { include: { questions: true } },
        },
      })

      // Look up answerId directly to avoid Prisma tx include inference limitations
      const savedAnswer = await tx.interviewAnswer.findUnique({ where: { questionId } })
      const answerId = savedAnswer?.id ?? ''

      let englishNotes: Awaited<ReturnType<typeof tx.englishNote.findMany>> = []
      if (params.usefulEnglishNotes.length > 0 && answerId) {
        await tx.englishNote.createMany({
          data: params.usefulEnglishNotes.map((note) => ({
            userId,
            answerId,
            originalSentence: note.userSentence,
            correctedSentence: note.correctedSentence,
            naturalVersion: note.naturalVersion,
            explanation: note.explanation,
            grammarTopic: note.grammarTopic,
            recommendedStudyTopics: note.recommendedTopics,
            practicePatterns: note.practicePatterns,
            aiMetadata: params.englishAiMetadata,
          })),
        })
        englishNotes = await tx.englishNote.findMany({
          where: { userId, answerId },
          orderBy: { createdAt: 'asc' },
        })
      }

      const weakConcepts = await Promise.all(
        params.weakConceptNames.map(async (concept) => {
          const existing = await tx.userWeakConcept.findFirst({ where: { userId, concept } })
          if (!existing) {
            return tx.userWeakConcept.create({
              data: {
                userId,
                concept,
                lastSeenAt: new Date(),
                sourceAnswerIds: [answerId],
              },
            })
          }
          const sourceAnswerIds = Array.from(new Set([...existing.sourceAnswerIds, answerId]))
          return tx.userWeakConcept.update({
            where: { id: existing.id },
            data: {
              occurrenceCount: existing.occurrenceCount + 1,
              lastSeenAt: new Date(),
              sourceAnswerIds,
            },
          })
        }),
      )

      await Promise.all(
        params.englishWeakTopics.map(async (topic) => {
          const existing = await tx.userEnglishWeakness.findFirst({ where: { userId, topic } })
          if (!existing) {
            return tx.userEnglishWeakness.create({
              data: { userId, topic, lastSeenAt: new Date(), sourceAnswerIds: [answerId] },
            })
          }
          const sourceAnswerIds = Array.from(new Set([...existing.sourceAnswerIds, answerId]))
          return tx.userEnglishWeakness.update({
            where: { id: existing.id },
            data: {
              occurrenceCount: existing.occurrenceCount + 1,
              lastSeenAt: new Date(),
              sourceAnswerIds,
            },
          })
        }),
      )

      return { session, englishNotes, weakConcepts }
    })
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
      noteId?: string | null
      sourceQuestionId?: string | null
      parentSessionId?: string | null
      version?: number
      contextSnapshot?: Prisma.InputJsonValue | null
    },
  ) {
    return this.prisma.interviewSession.create({
      data: {
        userId,
        type: input.type as never,
        mode: input.mode as never,
        status: 'IN_PROGRESS' as never,
        companyModeId: input.companyModeId,
        noteId: input.noteId ?? null,
        sourceQuestionId: input.sourceQuestionId ?? null,
        parentSessionId: input.parentSessionId ?? null,
        version: input.version ?? 1,
        maxTurns: input.maxTurns,
        overrideRole: input.overrideRole,
        overrideLevel: input.overrideLevel as never,
        overrideStack: input.overrideStack,
        overrideGoals: [],
        startedAt: new Date(),
        lastActivityAt: new Date(),
        contextSnapshot: input.contextSnapshot ?? undefined,
      },
      include: { companyMode: true, turns: true, summary: true, readinessImpact: true },
    })
  }

  async createInterviewTurn(data: {
    sessionId: string
    turnNumber: number
    role: string
    content: string
    decision?: string
    topicTags: string[]
    reasoning?: string | null
    references?: Prisma.InputJsonValue | null
    evaluation?: Prisma.InputJsonValue | null
    aiMetadata: Prisma.InputJsonValue | null
  }) {
    return this.prisma.$transaction(async (tx) => {
      const turn = await tx.interviewTurn.create({
        data: {
          sessionId: data.sessionId,
          turnNumber: data.turnNumber,
          role: data.role as never,
          content: data.content,
          decision: (data.decision ?? null) as never,
          topicTags: data.topicTags,
          reasoning: data.reasoning ?? null,
          references: (data.references ?? null) as never,
          evaluation: (data.evaluation ?? null) as never,
          aiMetadata: (data.aiMetadata ?? null) as never,
        },
      })

      await tx.interviewSession.update({
        where: { id: data.sessionId },
        data: {
          lastActivityAt: new Date(),
        },
      })

      return turn
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
      data: { currentTurnNum, lastActivityAt: new Date() },
    })
  }

  async endMultiTurnSession(sessionId: string) {
    return this.prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' as never, endedAt: new Date(), lastActivityAt: new Date() },
      include: {
        turns: { orderBy: { turnNumber: 'asc' } },
        companyMode: true,
        evaluation: true,
        summary: true,
        readinessImpact: true,
      },
    })
  }

  async findCompanyModeBySlug(slug: string) {
    return this.prisma.companyMode.findFirst({ where: { slug, isActive: true } })
  }

  async upsertSummary(
    sessionId: string,
    data: {
      headline: string
      keyTakeaways: string[]
      strengths: string[]
      weaknesses: string[]
      recommendations: string[]
      generatedFromVersion: number
      transcript: Prisma.InputJsonValue | null
    },
  ) {
    return this.prisma.interviewSummary.upsert({
      where: { sessionId },
      create: { sessionId, ...data, transcript: data.transcript as never },
      update: { ...data, transcript: data.transcript as never, updatedAt: new Date() },
    })
  }

  async upsertReadinessImpact(
    sessionId: string,
    userId: string,
    data: {
      overallDelta: number
      technicalDelta: number
      behavioralDelta: number
      systemDesignDelta: number
      communicationDelta: number
      consistencyDelta: number
      snapshot: Prisma.InputJsonValue | null
    },
  ) {
    return this.prisma.interviewReadinessImpact.upsert({
      where: { sessionId },
      create: {
        sessionId,
        userId,
        overallDelta: data.overallDelta,
        technicalDelta: data.technicalDelta,
        behavioralDelta: data.behavioralDelta,
        systemDesignDelta: data.systemDesignDelta,
        communicationDelta: data.communicationDelta,
        consistencyDelta: data.consistencyDelta,
        snapshot: data.snapshot as never,
      },
      update: {
        overallDelta: data.overallDelta,
        technicalDelta: data.technicalDelta,
        behavioralDelta: data.behavioralDelta,
        systemDesignDelta: data.systemDesignDelta,
        communicationDelta: data.communicationDelta,
        consistencyDelta: data.consistencyDelta,
        snapshot: data.snapshot as never,
      },
    })
  }
}
