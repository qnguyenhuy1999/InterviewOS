import type { Prisma } from '@interviewos/database'
import type { CompanyModeConfig, ExperienceLevel, InterviewType } from '@interviewos/types'
import { SessionMode, TurnDecision, TurnRole } from '@interviewos/types'
import { startMultiTurnSessionSchema, submitTurnSchema } from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { EvaluationService } from '../evaluation/evaluation.service'
import { ReadinessService } from '../readiness/readiness.service'
import { UsersRepository } from '../users/users.repository'
import type { StartMultiTurnSessionDto, SubmitTurnDto } from './dto/interview.dto'
import { InterviewRepository } from './interview.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class InterviewTurnService {
  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
    private readonly evaluationService: EvaluationService,
    private readonly readinessService: ReadinessService,
  ) {}

  async startMultiTurnSession(currentUser: CurrentUserRef, payload: StartMultiTurnSessionDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    if (!profile) throw new BadRequestException('Complete onboarding before starting an interview.')

    const input = startMultiTurnSessionSchema.parse(payload)
    const companyMode = input.companyModeSlug
      ? await this.interviewRepository.findCompanyModeBySlug(input.companyModeSlug)
      : null

    if (input.companyModeSlug && !companyMode) {
      throw new NotFoundException(`Company mode "${input.companyModeSlug}" not found.`)
    }

    const session = await this.interviewRepository.createMultiTurnSession(user.id, {
      type: input.type,
      mode: companyMode ? SessionMode.COMPANY : SessionMode.MULTI_TURN,
      companyModeId: companyMode?.id ?? null,
      maxTurns: input.maxTurns ?? 10,
      overrideRole: input.overrideRole ?? null,
      overrideLevel: (input.overrideLevel ?? profile.targetLevel) as ExperienceLevel,
      overrideStack: input.overrideStack ?? profile.techStack,
      noteId: input.noteId ?? null,
      contextSnapshot: this.toJsonValue({
        profile: {
          targetRole: profile.targetRole,
          targetLevel: profile.targetLevel,
          techStack: profile.techStack,
        },
        companyModeSlug: input.companyModeSlug ?? null,
      }),
    })

    const openingQuestion = getOpeningQuestion({
      companyQuestionBank:
        companyMode?.config && typeof companyMode.config === 'object'
          ? ((companyMode.config as unknown as CompanyModeConfig).questionBank ?? [])
          : [],
      type: input.type,
      role: input.overrideRole ?? profile.targetRole,
      stack: input.overrideStack ?? profile.techStack,
    })

    await this.interviewRepository.createInterviewTurn({
      sessionId: session.id,
      turnNumber: 1,
      role: TurnRole.INTERVIEWER,
      content: openingQuestion,
      decision: TurnDecision.ADVANCE,
      topicTags: input.overrideStack ?? profile.techStack,
      reasoning: 'Seeded opening question for a resumable interview session.',
      references: this.toJsonValue([]),
      evaluation: this.toJsonValue(null),
      aiMetadata: null,
    })
    await this.interviewRepository.incrementCurrentTurnNum(session.id, 1)

    return this.interviewRepository.findSessionById(user.id, session.id)
  }

  async submitTurn(currentUser: CurrentUserRef, sessionId: string, payload: SubmitTurnDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    if (!profile) throw new BadRequestException('Complete onboarding before practicing.')

    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) throw new NotFoundException('Interview session not found.')
    if (session.status === 'COMPLETED') throw new BadRequestException('Session already ended.')

    const input = submitTurnSchema.parse(payload)
    const nextTurnNum = session.currentTurnNum + 1

    const candidateTurn = await this.interviewRepository.createInterviewTurn({
      sessionId,
      turnNumber: nextTurnNum,
      role: TurnRole.CANDIDATE,
      content: input.answer,
      topicTags: [],
      reasoning: null,
      references: this.toJsonValue([]),
      evaluation: this.toJsonValue(null),
      aiMetadata: null,
    })

    const history = await this.interviewRepository.findTurnsBySession(sessionId)
    const isMaxTurns = nextTurnNum >= session.maxTurns

    if (isMaxTurns) {
      await this.interviewRepository.incrementCurrentTurnNum(sessionId, nextTurnNum)
      return {
        candidateTurn,
        interviewerTurn: null,
        decision: 'EVALUATE',
        turnNumber: nextTurnNum,
        isComplete: true,
      }
    }

    const companyModeConfig = (session as { companyMode?: { config: unknown } }).companyMode
      ?.config as CompanyModeConfig | undefined

    const aiResult = await this.aiGateway.conductInterviewTurn(
      {
        sessionType: session.type as InterviewType,
        userProfile: {
          level: (session.overrideLevel ?? profile.targetLevel) as ExperienceLevel,
          role: session.overrideRole ?? profile.targetRole,
          stack: session.overrideStack.length > 0 ? session.overrideStack : profile.techStack,
        },
        conversationHistory: history.map((t) => ({
          role: t.role as TurnRole,
          content: t.content,
          turnNumber: t.turnNumber,
        })),
        candidateAnswer: input.answer,
        companyModeConfig,
      },
      { userId: user.id },
    )

    const isComplete =
      aiResult.result.decision === 'EVALUATE' || aiResult.result.decision === 'WRAP_UP'

    const interviewerTurn = await this.interviewRepository.createInterviewTurn({
      sessionId,
      turnNumber: nextTurnNum + 1,
      role: TurnRole.INTERVIEWER,
      content: aiResult.result.nextQuestion,
      decision: aiResult.result.decision as TurnDecision,
      topicTags: aiResult.result.topicTags,
      reasoning: aiResult.result.reasoning,
      references: this.toJsonValue(aiResult.result.references ?? []),
      evaluation: this.toJsonValue(aiResult.result.evaluation ?? null),
      aiMetadata: aiResult.metadata as unknown as Prisma.InputJsonValue,
    })

    await this.interviewRepository.incrementCurrentTurnNum(sessionId, nextTurnNum + 1)

    return {
      candidateTurn,
      interviewerTurn: isComplete ? null : interviewerTurn,
      decision: aiResult.result.decision,
      turnNumber: nextTurnNum,
      isComplete,
    }
  }

  async getTurns(currentUser: CurrentUserRef, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) throw new NotFoundException('Interview session not found.')
    return this.interviewRepository.findTurnsBySession(sessionId)
  }

  async endSession(currentUser: CurrentUserRef, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) throw new NotFoundException('Interview session not found.')
    const previousReadiness = await this.readinessService.findLatest(user.id)
    const result = await this.interviewRepository.endMultiTurnSession(sessionId)
    await this.interviewRepository.upsertSummary(sessionId, buildSummary(result))
    const nextReadiness = await this.readinessService.computeAndSave(user.id)
    await this.interviewRepository.upsertReadinessImpact(
      sessionId,
      user.id,
      buildReadinessImpact(previousReadiness, nextReadiness),
    )
    void this.evaluationService.triggerEvaluation(sessionId, user.id).catch(() => undefined)
    return result
  }

  async getEvaluation(currentUser: CurrentUserRef, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.evaluationService.getEvaluation(user.id, sessionId)
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue | null {
    return value == null ? null : (value as Prisma.InputJsonValue)
  }
}

function getOpeningQuestion(input: {
  companyQuestionBank: string[]
  type: InterviewType
  role: string
  stack: string[]
}) {
  if (input.companyQuestionBank.length > 0) {
    return input.companyQuestionBank[0]
  }

  const stackLabel = input.stack.length > 0 ? input.stack.join(', ') : 'your main stack'

  switch (input.type) {
    case 'BEHAVIORAL':
      return `Tell me about a time you took ownership in a difficult situation as a ${input.role}. Walk me through the full context and outcome.`
    case 'SYSTEM_DESIGN':
      return `Design a production-ready system relevant to ${stackLabel}. Start by clarifying requirements before proposing architecture.`
    case 'MIXED':
      return `You are interviewing for a ${input.role} position. Start by explaining a recent technical problem you solved and the tradeoffs behind your approach.`
    default:
      return `For a ${input.role} role working with ${stackLabel}, explain how you would solve a production bug where users see inconsistent data after a write.`
  }
}

function buildSummary(session: {
  version?: number | null
  type: string
  companyMode?: { name: string } | null
  turns: Array<{ turnNumber: number; role: string; content: string; decision?: string | null }>
}) {
  const transcript = session.turns.map((turn) => ({
    turnNumber: turn.turnNumber,
    role: turn.role,
    content: turn.content,
    decision: turn.decision ?? null,
  }))
  const candidateTurns = session.turns.filter((turn) => turn.role === 'CANDIDATE')
  const firstAnswer =
    candidateTurns[0]?.content.slice(0, 140) ?? 'Candidate completed the interview.'
  const lastAnswer = candidateTurns.at(-1)?.content.slice(0, 140) ?? firstAnswer

  return {
    headline: `${session.companyMode?.name ?? session.type} interview summary`,
    keyTakeaways: [firstAnswer, lastAnswer].filter(
      (value, index, array): value is string => Boolean(value) && array.indexOf(value) === index,
    ),
    strengths:
      candidateTurns.length > 1
        ? ['Maintained momentum through follow-up questions.']
        : ['Completed the full interview prompt.'],
    weaknesses: [
      'Detailed evaluation will refine technical and communication gaps once scoring completes.',
    ],
    recommendations: [
      'Review the transcript and compare each answer against the final evaluation evidence.',
    ],
    generatedFromVersion: session.version ?? 1,
    transcript: transcript as unknown as Prisma.InputJsonValue,
  }
}

function buildReadinessImpact(
  previous: {
    overallScore: number
    technicalMastery: number
    behavioralPerformance: number
    systemDesignPerformance: number
    englishCommunication: number
    interviewPerformance: number
  } | null,
  next: {
    overallScore: number
    technicalMastery: number
    behavioralPerformance: number
    systemDesignPerformance: number
    englishCommunication: number
    interviewPerformance: number
  },
) {
  return {
    overallDelta: next.overallScore - (previous?.overallScore ?? next.overallScore),
    technicalDelta:
      Math.round(next.technicalMastery * 100) -
      Math.round((previous?.technicalMastery ?? next.technicalMastery) * 100),
    behavioralDelta:
      Math.round(next.behavioralPerformance * 100) -
      Math.round((previous?.behavioralPerformance ?? next.behavioralPerformance) * 100),
    systemDesignDelta:
      Math.round(next.systemDesignPerformance * 100) -
      Math.round((previous?.systemDesignPerformance ?? next.systemDesignPerformance) * 100),
    communicationDelta:
      Math.round(next.englishCommunication * 100) -
      Math.round((previous?.englishCommunication ?? next.englishCommunication) * 100),
    consistencyDelta:
      Math.round(next.interviewPerformance * 100) -
      Math.round((previous?.interviewPerformance ?? next.interviewPerformance) * 100),
    snapshot: next as unknown as Prisma.InputJsonValue,
  }
}
