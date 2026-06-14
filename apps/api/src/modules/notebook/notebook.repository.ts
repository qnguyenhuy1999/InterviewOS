import type { Prisma } from '@interviewos/database'
import type {
  GenerateQuestionsInput,
  NoteCreateInput,
  NoteUpdateInput,
} from '@interviewos/validators'
import { Injectable } from '@nestjs/common'

import { handlePrismaWrite } from '../../common/utils/prisma-errors'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class NotebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(userId: string, payload: NoteCreateInput) {
    const advancedSettings = payload.advancedSettings ?? undefined

    return this.prisma.technicalNote.create({
      data: {
        userId,
        title: payload.title,
        topic: payload.topic?.trim() ? payload.topic.trim() : null,
        rawInput: payload.roughNotes,
        type: payload.type,
        overrideRole: advancedSettings?.targetRole,
        overrideLevel: advancedSettings?.targetLevel,
        overrideStack: advancedSettings?.techStack ?? [],
        overrideGoals: advancedSettings?.interviewGoals ?? [],
        overrideEnglishLevel: advancedSettings?.englishLevel,
        preferredOutputStyle: advancedSettings?.preferredOutputStyle,
      },
      include: {
        sections: true,
        questions: true,
      },
    })
  }

  async findNotes(userId: string) {
    return this.prisma.technicalNote.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        sections: true,
        questions: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }

  async findNoteById(userId: string, noteId: string) {
    return this.prisma.technicalNote.findFirst({
      where: {
        id: noteId,
        userId,
        deletedAt: null,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
  }

  async updateNote(userId: string, noteId: string, payload: NoteUpdateInput) {
    const clearAdvancedSettings = payload.advancedSettings === null
    const advancedSettings =
      payload.advancedSettings && payload.advancedSettings !== null
        ? payload.advancedSettings
        : undefined
    const topic = payload.topic

    return handlePrismaWrite(
      this.prisma.technicalNote.update({
        where: { id: noteId, userId, deletedAt: null },
        data: {
          title: payload.title,
          topic: topic === undefined ? undefined : topic && topic.trim() ? topic.trim() : null,
          rawInput: payload.roughNotes,
          type: payload.type,
          status: payload.status,
          overrideRole: clearAdvancedSettings ? null : advancedSettings?.targetRole,
          overrideLevel: clearAdvancedSettings ? null : advancedSettings?.targetLevel,
          overrideStack: clearAdvancedSettings ? [] : advancedSettings?.techStack,
          overrideGoals: clearAdvancedSettings ? [] : advancedSettings?.interviewGoals,
          overrideEnglishLevel: clearAdvancedSettings ? null : advancedSettings?.englishLevel,
          preferredOutputStyle: clearAdvancedSettings
            ? null
            : advancedSettings?.preferredOutputStyle,
        },
        include: {
          sections: true,
          questions: true,
        },
      }),
      'Technical note not found.',
    )
  }

  async deleteNote(userId: string, noteId: string) {
    return handlePrismaWrite(
      this.prisma.technicalNote.update({
        where: { id: noteId, userId, deletedAt: null },
        data: {
          deletedAt: new Date(),
          status: 'ARCHIVED',
        },
      }),
      'Technical note not found.',
    )
  }

  async setNoteStatus(userId: string, noteId: string, status: string) {
    return this.prisma.technicalNote.update({
      where: { id: noteId, userId, deletedAt: null },
      data: { status: status as never },
      include: {
        sections: { orderBy: { order: 'asc' } },
        questions: { orderBy: { createdAt: 'asc' } },
      },
    })
  }

  async replaceGeneratedContent(
    userId: string,
    noteId: string,
    payload: {
      structuredContent: Record<string, unknown>
      sections: Array<{ heading: string; content: string }>
      aiMetadata: Prisma.InputJsonValue
    },
  ) {
    return handlePrismaWrite(
      this.prisma.technicalNote.update({
        where: { id: noteId, userId, deletedAt: null },
        data: {
          structuredContent: payload.structuredContent as Prisma.InputJsonValue,
          aiMetadata: payload.aiMetadata,
          sections: {
            deleteMany: {},
            create: payload.sections.map((section, index) => ({
              heading: section.heading,
              content: section.content,
              order: index,
              aiMetadata: payload.aiMetadata,
            })),
          },
          status: 'PUBLISHED',
        },
        include: {
          sections: {
            orderBy: { order: 'asc' },
          },
          questions: true,
        },
      }),
      'Technical note not found.',
    )
  }

  async replaceQuestions(
    userId: string,
    noteId: string,
    questions: Array<{
      question: string
      category: string
      expectedAnswer: string
      difficulty: GenerateQuestionsInput['difficulty']
      expectedConcepts: string[]
      sourceSection: string
    }>,
    aiMetadata: Prisma.InputJsonValue,
  ) {
    return handlePrismaWrite(
      this.prisma.technicalNote.update({
        where: { id: noteId, userId, deletedAt: null },
        data: {
          questions: {
            deleteMany: {},
            create: questions.map((question) => ({
              question: question.question,
              category: question.category,
              expectedAnswer: question.expectedAnswer,
              difficulty: question.difficulty ?? 'MEDIUM',
              expectedConcepts: question.expectedConcepts,
              sourceSection: question.sourceSection,
              aiMetadata,
            })),
          },
        },
        include: {
          sections: {
            orderBy: { order: 'asc' },
          },
          questions: {
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
      'Technical note not found.',
    )
  }
}
