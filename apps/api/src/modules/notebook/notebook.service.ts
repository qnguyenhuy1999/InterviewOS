import type {
  AIExecutionMetadata,
  EnglishLevel,
  ExperienceLevel,
  NoteType,
  TechnicalNoteContent,
} from '@interviewos/types'
import type { Prisma } from '@interviewos/database'
import {
  generateQuestionsSchema,
  noteCreateSchema,
  noteUpdateSchema,
} from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { UsersRepository } from '../users/users.repository'
import { NotebookRepository } from './notebook.repository'

type CurrentUserLike = {
  id?: string
}

@Injectable()
export class NotebookService {
  constructor(
    private readonly notebookRepository: NotebookRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
  ) {}

  async createNote(currentUser: unknown, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const input = noteCreateSchema.parse(payload)
    return this.notebookRepository.createNote(user.id, input)
  }

  async findNotes(currentUser: unknown) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.notebookRepository.findNotes(user.id)
  }

  async findNoteById(currentUser: unknown, noteId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const note = await this.notebookRepository.findNoteById(user.id, noteId)

    if (!note) {
      throw new NotFoundException('Technical note not found.')
    }

    return note
  }

  async updateNote(currentUser: unknown, noteId: string, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const input = noteUpdateSchema.parse(payload)
    return this.notebookRepository.updateNote(user.id, noteId, input)
  }

  async deleteNote(currentUser: unknown, noteId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.notebookRepository.deleteNote(user.id, noteId)
  }

  async generateTechnicalNote(currentUser: unknown, noteId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const note = await this.notebookRepository.findNoteById(user.id, noteId)

    if (!note) {
      throw new NotFoundException('Technical note not found.')
    }

    const profile = await this.requireProfile(user.id)
    const generated = await this.aiGateway.generateTechnicalNote({
      topic: note.title,
      noteType: note.type as unknown as NoteType,
      targetLevel: (note.overrideLevel ?? profile.targetLevel) as unknown as ExperienceLevel,
      targetRole: note.overrideRole ?? profile.targetRole,
      englishLevel: (note.overrideEnglishLevel ?? profile.englishLevel) as unknown as EnglishLevel,
      techStack: note.overrideStack.length > 0 ? note.overrideStack : profile.techStack,
      interviewGoals: note.overrideGoals.length > 0 ? note.overrideGoals : profile.interviewGoals,
      preferredOutputStyle: note.preferredOutputStyle ?? profile.preferredOutputStyle,
      additionalContext: note.rawInput,
    }, { userId: user.id })

    return this.notebookRepository.replaceGeneratedContent(note.id, {
      structuredContent: generated.result.content as unknown as Record<string, unknown>,
      sections: generated.result.sections,
      aiMetadata: this.toAiMetadataJson(generated.metadata),
    })
  }

  async generateQuestions(currentUser: unknown, noteId: string, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const note = await this.notebookRepository.findNoteById(user.id, noteId)

    if (!note) {
      throw new NotFoundException('Technical note not found.')
    }

    if (!note.structuredContent) {
      throw new BadRequestException('Generate the technical note before creating questions.')
    }

    const input = generateQuestionsSchema.parse(payload)
    const questions = await this.aiGateway.generateQuestionsFromNote({
      noteId: note.id,
      title: note.title,
      content: note.structuredContent as unknown as TechnicalNoteContent,
      count: input.count,
      difficulty: input.difficulty,
    }, { userId: user.id })

    return this.notebookRepository.replaceQuestions(
      note.id,
      questions.result.questions,
      this.toAiMetadataJson(questions.metadata),
    )
  }

  private async requireProfile(userId: string) {
    const profile = await this.usersRepository.findProfileByUserId(userId)
    if (!profile) {
      throw new BadRequestException('Complete onboarding before generating AI content.')
    }
    return profile
  }

  private resolveUserId(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.id
  }

  private toAiMetadataJson(metadata: AIExecutionMetadata): Prisma.InputJsonValue {
    return metadata as unknown as Prisma.InputJsonValue
  }
}
