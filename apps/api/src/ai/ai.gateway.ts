import {
  AIGateway as PackageAIGateway,
  AIProviderError,
  AIResponseValidationError,
} from '@interviewos/ai'
import type {
  AIResult,
  AnalyzeResumeInput,
  AnalyzeResumeResult,
  BehavioralEvalInput,
  BehavioralEvalResult,
  ConductTurnInput,
  ConductTurnResult,
  EvaluateInterviewAnswerInput,
  EvaluateInterviewAnswerResult,
  GenerateEnglishFeedbackInput,
  GenerateEnglishFeedbackResult,
  GenerateQuestionsFromNoteInput,
  GenerateQuestionsFromNoteResult,
  GenerateTechnicalNoteInput,
  GenerateTechnicalNoteResult,
  ReadinessComputeInput,
  ReadinessComputeResult,
  RecommendNextLearningInput,
  RecommendNextLearningResult,
  SessionEvalInput,
  SessionEvalResult,
  SystemDesignEvalInput,
  SystemDesignEvalResult,
} from '@interviewos/types'
import { Injectable } from '@nestjs/common'

import { AIAuditRepository } from './ai-audit.repository'

type AIAuditContext = {
  userId?: string
}

@Injectable()
export class AIGateway {
  constructor(
    private readonly gateway: PackageAIGateway,
    private readonly aiAuditRepository: AIAuditRepository,
  ) {}

  generateTechnicalNote(
    input: GenerateTechnicalNoteInput,
    context: AIAuditContext,
  ): Promise<AIResult<GenerateTechnicalNoteResult>> {
    return this.run('generateTechnicalNote', context, () =>
      this.gateway.generateTechnicalNote(input),
    )
  }

  generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
    context: AIAuditContext,
  ): Promise<AIResult<GenerateQuestionsFromNoteResult>> {
    return this.run('generateQuestionsFromNote', context, () =>
      this.gateway.generateQuestionsFromNote(input),
    )
  }

  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
    context: AIAuditContext,
  ): Promise<AIResult<EvaluateInterviewAnswerResult>> {
    return this.run('evaluateInterviewAnswer', context, () =>
      this.gateway.evaluateInterviewAnswer(input),
    )
  }

  generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
    context: AIAuditContext,
  ): Promise<AIResult<GenerateEnglishFeedbackResult>> {
    return this.run('generateEnglishFeedback', context, () =>
      this.gateway.generateEnglishFeedback(input),
    )
  }

  recommendNextLearning(
    input: RecommendNextLearningInput,
    context: AIAuditContext,
  ): Promise<AIResult<RecommendNextLearningResult>> {
    return this.run('recommendNextLearning', context, () =>
      this.gateway.recommendNextLearning(input),
    )
  }

  analyzeResume(
    input: AnalyzeResumeInput,
    context: AIAuditContext,
  ): Promise<AIResult<AnalyzeResumeResult>> {
    return this.run('analyzeResume', context, () => this.gateway.analyzeResume(input))
  }

  conductInterviewTurn(
    input: ConductTurnInput,
    context: AIAuditContext,
  ): Promise<AIResult<ConductTurnResult>> {
    return this.run('conductInterviewTurn', context, () => this.gateway.conductInterviewTurn(input))
  }

  evaluateBehavioralAnswer(
    input: BehavioralEvalInput,
    context: AIAuditContext,
  ): Promise<AIResult<BehavioralEvalResult>> {
    return this.run('evaluateBehavioralAnswer', context, () =>
      this.gateway.evaluateBehavioralAnswer(input),
    )
  }

  evaluateSystemDesignTurn(
    input: SystemDesignEvalInput,
    context: AIAuditContext,
  ): Promise<AIResult<SystemDesignEvalResult>> {
    return this.run('evaluateSystemDesignTurn', context, () =>
      this.gateway.evaluateSystemDesignTurn(input),
    )
  }

  generateSessionEvaluation(
    input: SessionEvalInput,
    context: AIAuditContext,
  ): Promise<AIResult<SessionEvalResult>> {
    return this.run('generateSessionEvaluation', context, () =>
      this.gateway.generateSessionEvaluation(input),
    )
  }

  computeReadinessScore(
    input: ReadinessComputeInput,
    context: AIAuditContext,
  ): Promise<AIResult<ReadinessComputeResult>> {
    return this.run('computeReadinessScore', context, () =>
      this.gateway.computeReadinessScore(input),
    )
  }

  private async run<TResult>(
    operation: string,
    context: AIAuditContext,
    execute: () => Promise<AIResult<TResult>>,
  ) {
    const maxAttempts = 3
    let lastError: unknown

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await execute()
        await this.aiAuditRepository.createRequestLog({
          userId: context.userId,
          operation,
          metadata: result.metadata,
        })
        return result
      } catch (error) {
        lastError = error

        if (error instanceof AIResponseValidationError) {
          await this.aiAuditRepository.createRequestLog({
            userId: context.userId,
            operation,
            metadata: error.metadata,
            errorMessage: error.message,
          })
          throw error
        }

        if (error instanceof AIProviderError && error.retryable && attempt < maxAttempts) {
          const backoffMs = 2 ** (attempt - 1) * 1000
          await sleep(backoffMs)
          continue
        }

        throw error
      }
    }

    throw lastError
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
