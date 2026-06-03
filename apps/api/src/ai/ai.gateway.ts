import {
  AIGateway as PackageAIGateway,
  AIResponseValidationError,
} from '@interviewos/ai'
import type {
  AIResult,
  AnalyzeResumeInput,
  AnalyzeResumeResult,
  EvaluateInterviewAnswerInput,
  EvaluateInterviewAnswerResult,
  GenerateEnglishFeedbackInput,
  GenerateEnglishFeedbackResult,
  GenerateQuestionsFromNoteInput,
  GenerateQuestionsFromNoteResult,
  GenerateTechnicalNoteInput,
  GenerateTechnicalNoteResult,
  RecommendNextLearningInput,
  RecommendNextLearningResult,
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
    return this.run('generateTechnicalNote', context, () => this.gateway.generateTechnicalNote(input))
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

  private async run<TResult>(
    operation: string,
    context: AIAuditContext,
    execute: () => Promise<AIResult<TResult>>,
  ) {
    try {
      const result = await execute()
      await this.aiAuditRepository.createRequestLog({
        userId: context.userId,
        operation,
        metadata: result.metadata,
      })
      return result
    } catch (error) {
      if (error instanceof AIResponseValidationError) {
        await this.aiAuditRepository.createRequestLog({
          userId: context.userId,
          operation,
          metadata: error.metadata,
          errorMessage: error.message,
        })
      }

      throw error
    }
  }
}
