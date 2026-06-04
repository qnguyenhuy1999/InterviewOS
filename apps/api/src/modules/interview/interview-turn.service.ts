import type { Prisma } from '@interviewos/database'
import type {
  CompanyModeConfig,
  ExperienceLevel,
  InterviewType,
  TurnDecision,
} from '@interviewos/types'
import { SessionMode, TurnRole } from '@interviewos/types'
import { startMultiTurnSessionSchema, submitTurnSchema } from '@interviewos/validators'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { EvaluationService } from '../evaluation/evaluation.service'
import { ReadinessService } from '../readiness/readiness.service'
import { UsersRepository } from '../users/users.repository'
import { InterviewRepository } from './interview.repository'

type CurrentUserLike = { id?: string }

@Injectable()
export class InterviewTurnService {
  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
    private readonly evaluationService: EvaluationService,
    private readonly readinessService: ReadinessService,
  ) {}

  async startMultiTurnSession(currentUser: unknown, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    if (!profile) throw new BadRequestException('Complete onboarding before starting an interview.')

    const input = startMultiTurnSessionSchema.parse(payload)
    const companyMode = input.companyModeSlug
      ? await this.interviewRepository.findCompanyModeBySlug(input.companyModeSlug)
      : null

    if (input.companyModeSlug && !companyMode) {
      throw new NotFoundException(`Company mode "${input.companyModeSlug}" not found.`)
    }

    return this.interviewRepository.createMultiTurnSession(user.id, {
      type: input.type,
      mode: companyMode ? SessionMode.COMPANY : SessionMode.MULTI_TURN,
      companyModeId: companyMode?.id ?? null,
      maxTurns: input.maxTurns ?? 10,
      overrideRole: input.overrideRole ?? null,
      overrideLevel: (input.overrideLevel ?? profile.targetLevel) as ExperienceLevel,
      overrideStack: input.overrideStack ?? profile.techStack,
    })
  }

  async submitTurn(currentUser: unknown, sessionId: string, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const profile = await this.usersRepository.findProfileByUserId(user.id)
    if (!profile) throw new BadRequestException('Complete onboarding before practicing.')

    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) throw new NotFoundException('Interview session not found.')
    if (session.status === 'PUBLISHED') throw new BadRequestException('Session already ended.')

    const input = submitTurnSchema.parse(payload)
    const nextTurnNum = session.currentTurnNum + 1

    const candidateTurn = await this.interviewRepository.createInterviewTurn({
      sessionId,
      turnNumber: nextTurnNum,
      role: TurnRole.CANDIDATE,
      content: input.answer,
      topicTags: [],
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

  async getTurns(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) throw new NotFoundException('Interview session not found.')
    return this.interviewRepository.findTurnsBySession(sessionId)
  }

  async endSession(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const session = await this.interviewRepository.findSessionById(user.id, sessionId)
    if (!session) throw new NotFoundException('Interview session not found.')
    const result = await this.interviewRepository.endMultiTurnSession(sessionId)
    void this.evaluationService.triggerEvaluation(sessionId, user.id).catch(() => undefined)
    void this.readinessService.computeAndSave(user.id).catch(() => undefined)
    return result
  }

  async getEvaluation(currentUser: unknown, sessionId: string) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.evaluationService.getEvaluation(user.id, sessionId)
  }

  private resolveUserId(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.id
  }
}
