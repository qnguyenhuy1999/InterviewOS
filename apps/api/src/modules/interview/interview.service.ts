import type { Prisma } from '@interviewos/database'
import type { AIExecutionMetadata, EnglishLevel, ExperienceLevel, UserWeakConcept } from '@interviewos/types'
import { interviewAnswerSchema, startInterviewSessionSchema } from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { NotebookRepository } from '../notebook/notebook.repository'
import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import type { CreateInterviewSessionDto, SubmitInterviewAnswerDto } from './dto/interview.dto'
import { InterviewRepository } from './interview.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class InterviewService {
  private readonly reviewActions: Pick<
    ReviewService,
    'syncEnglishNoteReviews' | 'syncWeakConceptReviews'
  >

  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly notebookRepository: NotebookRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
    reviewService?: ReviewService,
  ) {
    this.reviewActions = reviewService ?? {
      syncEnglishNoteReviews: async () => undefined,
      syncWeakConceptReviews: async () => undefined,
    }
  }

  async createSession(currentUser: CurrentUserRef, payload: CreateInterviewSessionDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const input = startInterviewSessionSchema.parse(payload)
    const note = await this.findQuestionSource(user.id, input.generatedQuestionId)
    const questionData = noteQuestion(note, input.generatedQuestionId)

    return this.interviewRepository.createSessionFromGeneratedQuestion(user.id, {
      noteId: note.id,
      generatedQuestionId: input.generatedQuestionId,
      question: questionData.question,
      difficulty: questionData.difficulty,
      category: questionData.category,
      expectedConcepts: questionData.expectedConcepts,
      sourceSection: questionData.sourceSection,
    })
  }

  async findSessions(currentUser: CurrentUserRef) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.interviewRepository.findSessions(user.id)
  }

  async findSessionById(currentUser: CurrentUserRef, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)

    if (!session) {
      throw new NotFoundException('Interview session not found.')
    }

    return session
  }

  async answerQuestion(currentUser: CurrentUserRef, sessionId: string, payload: SubmitInterviewAnswerDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
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

    const usefulEnglishNotes = english.result.notes.filter(
      (note) =>
        note.correctedSentence.trim() !== note.userSentence.trim() || note.explanation.length > 20,
    )

    const { session: updatedSession, englishNotes, weakConcepts } =
      await this.interviewRepository.saveAnswerAtomic({
        sessionId: session.id,
        questionId: primaryQuestion.id,
        userId: user.id,
        answerPayload: {
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
        usefulEnglishNotes,
        weakConceptNames: technical.result.weakConcepts,
        englishWeakTopics: english.result.weakTopics,
        englishAiMetadata: this.toAiMetadataJson(english.metadata),
      })

    const answerId = updatedSession.questions[0]?.answer?.id
    if (!answerId) {
      throw new BadRequestException('Answer persistence failed.')
    }
    await this.reviewActions.syncEnglishNoteReviews(
      user.id,
      englishNotes.map((note) => ({
        id: note.id,
        grammarTopic: note.grammarTopic,
        originalSentence: note.originalSentence,
        status: note.status,
      })),
      this.toAiMetadataJson(english.metadata),
    )
    await this.reviewActions.syncWeakConceptReviews(user.id, weakConcepts as unknown as UserWeakConcept[])

    return this.interviewRepository.findSessionById(user.id, session.id)
  }

  async updateSession(currentUser: CurrentUserRef, sessionId: string, payload: SubmitInterviewAnswerDto) {
    return this.answerQuestion(currentUser, sessionId, payload)
  }

  async deleteSession(currentUser: CurrentUserRef, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
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
