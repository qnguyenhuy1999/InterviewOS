import type { Prisma } from '@interviewos/database'
import type {
  AIExecutionMetadata,
  EnglishLevel,
  ExperienceLevel,
  NoteType,
  TechnicalNoteContent,
} from '@interviewos/types'
import {
  generateQuestionsSchema,
  noteCreateSchema,
  noteUpdateSchema,
} from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import { NotebookRepository } from './notebook.repository'

type CurrentUserLike = {
  id?: string
}

@Injectable()
export class NotebookService {
  private readonly reviewActions: {
    syncTechnicalNoteReview: (payload: {
      userId: string
      noteId: string
      title: string
      status: string
      aiMetadata?: Prisma.InputJsonValue
    }) => Promise<unknown>
    replaceQuestionReviews: (payload: {
      userId: string
      noteId: string
      questions: Array<{
        id: string
        question: string
        difficulty: string
        expectedConcepts: string[]
      }>
      aiMetadata?: Prisma.InputJsonValue
    }) => Promise<unknown>
  }

  constructor(
    private readonly notebookRepository: NotebookRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
    reviewService?: ReviewService,
  ) {
    this.reviewActions = reviewService ?? {
      syncTechnicalNoteReview: async () => undefined,
      replaceQuestionReviews: async () => undefined,
    }
  }

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
    const note = await this.notebookRepository.updateNote(user.id, noteId, input)
    await this.reviewActions.syncTechnicalNoteReview({
      userId: user.id,
      noteId: note.id,
      title: note.title,
      status: note.status,
      aiMetadata: note.aiMetadata as Prisma.InputJsonValue | undefined,
    })
    return note
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

    const saved = await this.notebookRepository.replaceGeneratedContent(note.id, {
      structuredContent: generated.result.content as unknown as Record<string, unknown>,
      sections: generated.result.sections,
      aiMetadata: this.toAiMetadataJson(generated.metadata),
    })
    await this.reviewActions.syncTechnicalNoteReview({
      userId: user.id,
      noteId: saved.id,
      title: saved.title,
      status: saved.status,
      aiMetadata: this.toAiMetadataJson(generated.metadata),
    })
    return saved
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

    const saved = await this.notebookRepository.replaceQuestions(
      note.id,
      questions.result.questions,
      this.toAiMetadataJson(questions.metadata),
    )
    await this.reviewActions.replaceQuestionReviews({
      userId: user.id,
      noteId: saved.id,
      questions: saved.questions.map((question) => ({
        id: question.id,
        question: question.question,
        difficulty: question.difficulty,
        expectedConcepts: question.expectedConcepts,
      })),
      aiMetadata: this.toAiMetadataJson(questions.metadata),
    })
    return saved
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
