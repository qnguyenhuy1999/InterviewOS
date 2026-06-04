import type { Prisma } from '@interviewos/database'
import type {
  DesignDimensionScores,
  DimensionScores,
  ExperienceLevel,
  InterviewType,
  RubricDimensionScore,
  StarDimensionScores,
} from '@interviewos/types'
import { Injectable, NotFoundException } from '@nestjs/common'

import { AIGateway } from '../../ai/ai.gateway'
import { EvaluationRepository } from './evaluation.repository'

@Injectable()
export class EvaluationService {
  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly aiGateway: AIGateway,
  ) {}

  async getEvaluation(userId: string, sessionId: string) {
    const session = await this.evaluationRepository.findOwnedSession(userId, sessionId)
    if (!session) throw new NotFoundException('Session not found.')
    const evaluation = await this.evaluationRepository.findBySession(sessionId)
    if (!evaluation) throw new NotFoundException('Evaluation not ready yet.')
    return evaluation
  }

  async triggerEvaluation(sessionId: string, userId: string): Promise<void> {
    const session = await this.evaluationRepository.findSessionWithTurns(sessionId)
    if (!session) return

    await this.evaluationRepository.createPending(sessionId)

    try {
      const firstQuestion =
        session.turns.find((t) => t.role === 'INTERVIEWER')?.content ?? 'Interview session'
      const conversation = session.turns.map((t) => ({
        role: t.role as import('@interviewos/types').TurnRole,
        content: t.content,
      }))
      const profile = await this.evaluationRepository.findUserProfile(userId)

      const result = await this.aiGateway.generateSessionEvaluation(
        {
          sessionType: session.type as InterviewType,
          question: firstQuestion,
          conversation,
          userProfile: {
            level: (session.overrideLevel ?? profile?.targetLevel ?? 'MID') as ExperienceLevel,
            role: session.overrideRole ?? profile?.targetRole ?? 'Software Engineer',
          },
        },
        { userId },
      )

      const rubricScores = buildRubricScores(
        session.type as InterviewType,
        result.result.dimensionScores,
        result.result.starScores as StarDimensionScores | undefined,
        result.result.designScores as DesignDimensionScores | undefined,
      )
      const evidence = buildEvidence(conversation)
      const weaknesses = buildWeaknesses(result.result.improvements)
      const recommendations = buildRecommendations(result.result.coachingNotes)

      await this.evaluationRepository.markComplete(sessionId, {
        overallScore: result.result.overallScore,
        summary:
          result.result.summary ??
          `${result.result.strengths[0] ?? 'Solid effort.'} ${result.result.improvements[0] ?? ''}`.trim(),
        confidence: result.result.confidence ?? inferConfidence(conversation.length),
        dimensionScores: result.result.dimensionScores as unknown as Prisma.InputJsonValue,
        rubricScores: rubricScores as unknown as Prisma.InputJsonValue,
        evidence: evidence as unknown as Prisma.InputJsonValue,
        weaknesses: weaknesses as unknown as Prisma.InputJsonValue,
        recommendations: recommendations as unknown as Prisma.InputJsonValue,
        strengths: result.result.strengths,
        improvements: result.result.improvements,
        coachingNotes: result.result.coachingNotes,
        weakConcepts: result.result.weakConcepts,
        starScores: result.result.starScores as unknown as Prisma.InputJsonValue,
        designScores: result.result.designScores as unknown as Prisma.InputJsonValue,
        aiMetadata: result.metadata as unknown as Prisma.InputJsonValue,
      })
    } catch {
      await this.evaluationRepository.markFailed(sessionId)
    }
  }
}

function inferConfidence(turnCount: number) {
  return Math.max(40, Math.min(95, 45 + turnCount * 5))
}

function buildEvidence(conversation: Array<{ role: string; content: string }>) {
  return conversation
    .filter((item) => item.role === 'CANDIDATE')
    .slice(0, 3)
    .map((item, index) => ({
      quote: item.content.slice(0, 220),
      rationale:
        index === 0
          ? 'Shows the candidate baseline approach.'
          : 'Captures a later answer used in the evaluation.',
      turnNumber: index + 1,
    }))
}

function buildWeaknesses(items: string[]) {
  return items.slice(0, 4).map((item, index) => ({
    title: `Gap ${index + 1}`,
    detail: item,
    severity: index === 0 ? 'HIGH' : index === 1 ? 'MEDIUM' : 'LOW',
  }))
}

function buildRecommendations(items: string[]) {
  return items.slice(0, 4).map((item, index) => ({
    title: `Recommendation ${index + 1}`,
    detail: item,
    priority: index === 0 ? 'NOW' : index === 1 ? 'NEXT' : 'LATER',
  }))
}

function buildRubricScores(
  interviewType: InterviewType,
  dimensionScores: DimensionScores,
  starScores?: StarDimensionScores,
  designScores?: DesignDimensionScores,
): RubricDimensionScore[] {
  if (interviewType === 'BEHAVIORAL' && starScores) {
    return [
      rubric('star-situation', 'STAR Situation', starScores.situation * 10),
      rubric('star-task', 'STAR Task', starScores.task * 10),
      rubric('star-action', 'STAR Action', starScores.action * 10),
      rubric('star-result', 'STAR Result', starScores.result * 10),
      rubric('leadership', 'Leadership', starScores.overall * 10),
      rubric('impact', 'Impact', starScores.result * 10),
    ]
  }

  if (interviewType === 'SYSTEM_DESIGN' && designScores) {
    return [
      rubric('scalability', 'Scalability', designScores.scalability * 10),
      rubric('reliability', 'Reliability', designScores.reliability * 10),
      rubric('tradeoffs', 'Tradeoffs', designScores.tradeoffAnalysis * 10),
      rubric('architecture', 'Architecture', designScores.architectureDepth * 10),
    ]
  }

  return [
    rubric('correctness', 'Correctness', (dimensionScores.correctness ?? 0) * 10),
    rubric('depth', 'Depth', (dimensionScores.depth ?? 0) * 10),
    rubric('communication', 'Communication', dimensionScores.clarity * 10),
    rubric('problem-solving', 'Problem Solving', (dimensionScores.problemSolving ?? 0) * 10),
  ]
}

function rubric(key: string, label: string, score: number): RubricDimensionScore {
  return {
    key,
    label,
    score: Math.round(score),
    evidence: [],
  }
}
