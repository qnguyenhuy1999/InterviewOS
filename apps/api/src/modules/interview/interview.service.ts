import type { Prisma } from '@interviewos/database'
import type { AIExecutionMetadata, EnglishLevel, ExperienceLevel } from '@interviewos/types'
import { interviewAnswerSchema, startInterviewSessionSchema } from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { NotebookRepository } from '../notebook/notebook.repository'
import { UsersRepository } from '../users/users.repository'
import { InterviewRepository } from './interview.repository'

type CurrentUserLike = {
  id?: string
}

@Injectable()
export class InterviewService {
  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly notebookRepository: NotebookRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
  ) {}

  async createSession(currentUser: unknown, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const input = startInterviewSessionSchema.parse(payload)
    const note = await this.findQuestionSource(user.id, input.generatedQuestionId)

    return this.interviewRepository.createSessionFromGeneratedQuestion(user.id, {
      noteId: note.id,
      generatedQuestionId: input.generatedQuestionId,
      question: noteQuestion(note, input.generatedQuestionId).question,
      difficulty: noteQuestion(note, input.generatedQuestionId).difficulty,
      category: noteQuestion(note, input.generatedQuestionId).category,
      expectedConcepts: noteQuestion(note, input.generatedQuestionId).expectedConcepts,
      sourceSection: noteQuestion(note, input.generatedQuestionId).sourceSection,
    })
  }

  async findSessions(currentUser: unknown) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.interviewRepository.findSessions(user.id)
  }

  async findSessionById(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)

    if (!session) {
      throw new NotFoundException('Interview session not found.')
    }

    return session
  }

  async answerQuestion(currentUser: unknown, sessionId: string, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    if (!profile) {
      throw new BadRequestException('Complete onboarding before practicing questions.')
    }

    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) {
      throw new NotFoundException('Interview session not found.')
    }

    const primaryQuestion = session.questions[0]
    if (!primaryQuestion) {
      throw new BadRequestException('The session does not contain a question.')
    }

    const input = interviewAnswerSchema.parse(payload)
    const advancedSettings = input.advancedSettings ?? undefined
    const targetLevel =
      advancedSettings?.targetLevel ??
      session.overrideLevel ??
      (profile.targetLevel as unknown as ExperienceLevel)
    const englishLevel =
      advancedSettings?.englishLevel ??
      session.overrideEnglishLevel ??
      (profile.englishLevel as unknown as EnglishLevel)
    const technical = await this.aiGateway.evaluateInterviewAnswer({
      question: primaryQuestion.question,
      answer: input.answer,
      expectedConcepts: primaryQuestion.expectedConcepts,
      sourceSection: primaryQuestion.sourceSection,
      targetLevel: targetLevel as ExperienceLevel,
    }, { userId: user.id })
    const english = await this.aiGateway.generateEnglishFeedback({
      text: input.answer,
      targetLevel: englishLevel as EnglishLevel,
    }, { userId: user.id })

    const updatedSession = await this.interviewRepository.saveAnswer(
      session.id,
      primaryQuestion.id,
      {
        overrideRole: advancedSettings?.targetRole ?? session.overrideRole,
        overrideLevel: targetLevel as ExperienceLevel,
        overrideStack:
          advancedSettings?.techStack && advancedSettings.techStack.length > 0
            ? advancedSettings.techStack
            : session.overrideStack,
        overrideGoals:
          advancedSettings?.interviewGoals && advancedSettings.interviewGoals.length > 0
            ? advancedSettings.interviewGoals
            : session.overrideGoals,
        overrideEnglishLevel: englishLevel as EnglishLevel,
        preferredOutputStyle:
          advancedSettings?.preferredOutputStyle ?? session.preferredOutputStyle,
        rawAnswer: input.answer,
        technicalScore: technical.result.technicalScore,
        englishScore: technical.result.englishScore,
        clarityScore: technical.result.clarityScore,
        overallScore: technical.result.overallScore,
        aiFeedback: technical.result.summary,
        technicalFeedback: {
          summary: technical.result.summary,
          strengths: technical.result.strengths,
          improvements: technical.result.improvements,
        } satisfies Prisma.JsonObject,
        englishFeedback: {
          summary: english.result.feedback,
          overallScore: english.result.overallScore,
          highlightedTopics: english.result.weakTopics,
        } satisfies Prisma.JsonObject,
        nextRecommendedQuestion:
          technical.result.nextRecommendedQuestion satisfies Prisma.JsonObject,
        recommendedLearning: technical.result.recommendedLearning satisfies Prisma.JsonObject,
        weakConcepts: technical.result.weakConcepts,
        aiMetadata: this.toAiMetadataJson(technical.metadata),
      },
    )

    const answerId = updatedSession.questions[0]?.answer?.id
    if (!answerId) {
      throw new BadRequestException('Answer persistence failed.')
    }

    const usefulEnglishNotes = english.result.notes.filter(
      (note) =>
        note.correctedSentence.trim() !== note.userSentence.trim() || note.explanation.length > 20,
    )

    await this.interviewRepository.saveEnglishNotes(
      user.id,
      answerId,
      usefulEnglishNotes,
      this.toAiMetadataJson(english.metadata),
    )
    await this.interviewRepository.upsertWeakConcepts(
      user.id,
      answerId,
      technical.result.weakConcepts,
    )
    await this.interviewRepository.upsertEnglishWeaknesses(
      user.id,
      answerId,
      english.result.weakTopics,
    )

    return this.interviewRepository.findSessionById(user.id, session.id)
  }

  async updateSession(currentUser: unknown, sessionId: string, payload: Record<string, unknown>) {
    return this.answerQuestion(currentUser, sessionId, payload)
  }

  async deleteSession(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.interviewRepository.deleteSession(user.id, sessionId)
  }

  private async findQuestionSource(userId: string, generatedQuestionId: string) {
    const notes = await this.notebookRepository.findNotes(userId)
    const note = notes.find((item) =>
      item.questions.some((question) => question.id === generatedQuestionId),
    )

    if (!note) {
      throw new NotFoundException('Generated question not found.')
    }

    return note
  }

  private resolveUserId(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.id
  }

  private toAiMetadataJson(metadata: AIExecutionMetadata): Prisma.InputJsonValue {
    return metadata as unknown as Prisma.InputJsonValue
  }
}

function noteQuestion<
  TNote extends {
    questions: Array<{
      id: string
      question: string
      difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
      category: string
      expectedConcepts: string[]
      sourceSection: string
    }>
  },
>(note: TNote, generatedQuestionId: string) {
  const question = note.questions.find((item) => item.id === generatedQuestionId)

  if (!question) {
    throw new NotFoundException('Generated question not found.')
  }

  return question
}
