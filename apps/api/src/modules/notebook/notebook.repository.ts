import type { Prisma } from '@interviewos/database'
import type {
  GenerateQuestionsInput,
  NoteCreateInput,
  NoteUpdateInput,
} from '@interviewos/validators'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class NotebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(userId: string, payload: NoteCreateInput) {
    return this.prisma.technicalNote.create({
      data: {
        userId,
        title: payload.title,
        rawInput: payload.roughNotes,
        type: payload.type,
        overrideRole: payload.advancedSettings?.targetRole,
        overrideLevel: payload.advancedSettings?.targetLevel,
        overrideStack: payload.advancedSettings?.techStack ?? [],
        overrideGoals: payload.advancedSettings?.interviewGoals ?? [],
        overrideEnglishLevel: payload.advancedSettings?.englishLevel,
        preferredOutputStyle: payload.advancedSettings?.preferredOutputStyle,
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
    return this.prisma.technicalNote.update({
      where: { id: noteId, userId },
      data: {
        title: payload.title,
        rawInput: payload.roughNotes,
        type: payload.type,
        status: payload.status,
        overrideRole: payload.advancedSettings?.targetRole,
        overrideLevel: payload.advancedSettings?.targetLevel,
        overrideStack: payload.advancedSettings?.techStack,
        overrideGoals: payload.advancedSettings?.interviewGoals,
        overrideEnglishLevel: payload.advancedSettings?.englishLevel,
        preferredOutputStyle: payload.advancedSettings?.preferredOutputStyle,
      },
      include: {
        sections: true,
        questions: true,
      },
    })
  }

  async deleteNote(userId: string, noteId: string) {
    return this.prisma.technicalNote.update({
      where: { id: noteId, userId },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    })
  }

  async replaceGeneratedContent(
    noteId: string,
    payload: {
      structuredContent: Record<string, unknown>
      sections: Array<{ heading: string; content: string }>
    },
  ) {
    return this.prisma.technicalNote.update({
      where: { id: noteId },
      data: {
        structuredContent: payload.structuredContent as Prisma.InputJsonValue,
        sections: {
          deleteMany: {},
          create: payload.sections.map((section, index) => ({
            heading: section.heading,
            content: section.content,
            order: index,
          })),
        },
        status: 'PUBLISHED',
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        questions: true,
      },
    })
  }

  async replaceQuestions(
    noteId: string,
    questions: Array<{
      question: string
      category: string
      expectedAnswer: string
      difficulty: GenerateQuestionsInput['difficulty']
      expectedConcepts: string[]
      sourceSection: string
    }>,
  ) {
    return this.prisma.technicalNote.update({
      where: { id: noteId },
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
          })),
        },
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
}
