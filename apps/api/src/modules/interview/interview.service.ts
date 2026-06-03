import type { Prisma } from '@interviewos/database'
import type { EnglishLevel, ExperienceLevel } from '@interviewos/types'
import { interviewAnswerSchema, startInterviewSessionSchema } from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { NotebookRepository } from '../notebook/notebook.repository'
import { UsersRepository } from '../users/users.repository'
import { InterviewRepository } from './interview.repository'

type CurrentUserLike = {
  email?: string
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
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
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
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
    return this.interviewRepository.findSessions(user.id)
  }

  async findSessionById(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)

    if (!session) {
      throw new NotFoundException('Interview session not found.')
    }

    return session
  }

  async answerQuestion(currentUser: unknown, sessionId: string, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
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
    const technical = await this.aiGateway.evaluateInterviewAnswer({
      question: primaryQuestion.question,
      answer: input.answer,
      expectedConcepts: primaryQuestion.expectedConcepts,
      sourceSection: primaryQuestion.sourceSection,
      targetLevel: profile.targetLevel as unknown as ExperienceLevel,
    })
    const english = await this.aiGateway.generateEnglishFeedback({
      text: input.answer,
      targetLevel: profile.englishLevel as unknown as EnglishLevel,
    })

    const updatedSession = await this.interviewRepository.saveAnswer(
      session.id,
      primaryQuestion.id,
      {
        rawAnswer: input.answer,
        technicalScore: technical.technicalScore,
        englishScore: technical.englishScore,
        clarityScore: technical.clarityScore,
        overallScore: technical.overallScore,
        aiFeedback: technical.summary,
        technicalFeedback: {
          summary: technical.summary,
          strengths: technical.strengths,
          improvements: technical.improvements,
        } satisfies Prisma.JsonObject,
        englishFeedback: {
          summary: english.feedback,
          overallScore: english.overallScore,
          highlightedTopics: english.weakTopics,
        } satisfies Prisma.JsonObject,
        nextRecommendedQuestion: technical.nextRecommendedQuestion satisfies Prisma.JsonObject,
        recommendedLearning: technical.recommendedLearning satisfies Prisma.JsonObject,
        weakConcepts: technical.weakConcepts,
      },
    )

    const answerId = updatedSession.questions[0]?.answer?.id
    if (!answerId) {
      throw new BadRequestException('Answer persistence failed.')
    }

    const usefulEnglishNotes = english.notes.filter(
      (note) =>
        note.correctedSentence.trim() !== note.userSentence.trim() || note.explanation.length > 20,
    )

    await this.interviewRepository.saveEnglishNotes(user.id, answerId, usefulEnglishNotes)
    await this.interviewRepository.upsertWeakConcepts(user.id, answerId, technical.weakConcepts)
    await this.interviewRepository.upsertEnglishWeaknesses(user.id, answerId, english.weakTopics)

    return this.interviewRepository.findSessionById(user.id, session.id)
  }

  async updateSession(currentUser: unknown, sessionId: string, payload: Record<string, unknown>) {
    return this.answerQuestion(currentUser, sessionId, payload)
  }

  async deleteSession(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserByEmail(this.resolveEmail(currentUser))
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

  private resolveEmail(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.email
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
