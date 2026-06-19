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
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { AIContextBuilder } from '../../ai/ai-context.builder'
import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import type { CreateNoteDto, GenerateQuestionsDto, UpdateNoteDto } from './dto/notebook.dto'
import { NotebookRepository } from './notebook.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class NotebookService {
  private readonly logger = new Logger(NotebookService.name)

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
    private readonly aiContextBuilder: AIContextBuilder,
    reviewService: ReviewService,
  ) {
    this.reviewActions = reviewService
  }

  async createNote(currentUser: CurrentUserRef, payload: CreateNoteDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const input = noteCreateSchema.parse(payload)
    return this.notebookRepository.createNote(user.id, input)
  }

  async findNotes(currentUser: CurrentUserRef) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.notebookRepository.findNotes(user.id)
  }

  async findNoteById(currentUser: CurrentUserRef, noteId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const note = await this.notebookRepository.findNoteById(user.id, noteId)

    if (!note) {
      throw new NotFoundException('Technical note not found.')
    }

    return note
  }

  async updateNote(currentUser: CurrentUserRef, noteId: string, payload: UpdateNoteDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
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

  async deleteNote(currentUser: CurrentUserRef, noteId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.notebookRepository.deleteNote(user.id, noteId)
  }

  async generateTechnicalNote(currentUser: CurrentUserRef, noteId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const note = await this.notebookRepository.findNoteById(user.id, noteId)

    if (!note) {
      throw new NotFoundException('Technical note not found.')
    }

    await this.requireProfile(user.id)

    const generating = await this.notebookRepository.setNoteStatus(user.id, note.id, 'GENERATING')

    void this.runTechnicalNoteGeneration(user.id, note.id).catch((err: unknown) => {
      this.logger.error(
        `Background generation failed for note ${note.id}: ${err instanceof Error ? err.message : String(err)}`,
      )
    })

    return generating
  }

  private async runTechnicalNoteGeneration(userId: string, noteId: string) {
    const note = await this.notebookRepository.findNoteById(userId, noteId)
    if (!note) return

    const profile = await this.usersRepository.findProfileByUserId(userId)
    if (!profile) {
      await this.notebookRepository.setNoteStatus(userId, noteId, 'DRAFT')
      return
    }

    try {
      const targetLevel = (note.overrideLevel ?? profile.targetLevel) as unknown as ExperienceLevel
      const aiContext = this.aiContextBuilder.build({
        targetLevel,
        englishLevel: (note.overrideEnglishLevel ?? profile.englishLevel) as unknown as EnglishLevel,
        techStack: note.overrideStack.length > 0 ? note.overrideStack : profile.techStack,
        targetRole: note.overrideRole ?? profile.targetRole ?? undefined,
        interviewGoals: note.overrideGoals.length > 0 ? note.overrideGoals : profile.interviewGoals,
        weakConcepts: [],
      })
      const generated = await this.aiGateway.generateTechnicalNote(
        {
          topic: note.title,
          noteType: note.type as unknown as NoteType,
          targetLevel,
          targetRole: note.overrideRole ?? profile.targetRole,
          englishLevel: (note.overrideEnglishLevel ?? profile.englishLevel) as unknown as EnglishLevel,
          techStack: note.overrideStack.length > 0 ? note.overrideStack : profile.techStack,
          interviewGoals: note.overrideGoals.length > 0 ? note.overrideGoals : profile.interviewGoals,
          preferredOutputStyle: note.preferredOutputStyle ?? profile.preferredOutputStyle,
          additionalContext: note.rawInput,
          explanationDepth: aiContext.explanationDepth,
        },
        { userId },
      )

      const saved = await this.notebookRepository.replaceGeneratedContent(userId, note.id, {
        structuredContent: generated.result.content as unknown as Record<string, unknown>,
        sections: generated.result.sections,
        aiMetadata: this.toAiMetadataJson(generated.metadata),
      })
      await this.reviewActions.syncTechnicalNoteReview({
        userId,
        noteId: saved.id,
        title: saved.title,
        status: saved.status,
        aiMetadata: this.toAiMetadataJson(generated.metadata),
      })
    } catch (err) {
      await this.notebookRepository.setNoteStatus(userId, noteId, 'DRAFT')
      throw err
    }
  }

  async generateQuestions(
    currentUser: CurrentUserRef,
    noteId: string,
    payload: GenerateQuestionsDto,
  ) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const note = await this.notebookRepository.findNoteById(user.id, noteId)

    if (!note) {
      throw new NotFoundException('Technical note not found.')
    }

    if (!note.structuredContent) {
      throw new BadRequestException('Generate the technical note before creating questions.')
    }

    const input = generateQuestionsSchema.parse(payload)
    const questions = await this.aiGateway.generateQuestionsFromNote(
      {
        noteId: note.id,
        title: note.title,
        content: note.structuredContent as unknown as TechnicalNoteContent,
        count: input.count,
        difficulty: input.difficulty,
      },
      { userId: user.id },
    )

    const saved = await this.notebookRepository.replaceQuestions(
      user.id,
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

  private toAiMetadataJson(metadata: AIExecutionMetadata): Prisma.InputJsonValue {
    return metadata as unknown as Prisma.InputJsonValue
  }
}
