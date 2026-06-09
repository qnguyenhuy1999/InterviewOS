import type {
  AIExecutionMetadata,
  AIProvider,
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
  ImproveTechnicalNoteInput,
  ImproveTechnicalNoteResult,
  ReadinessComputeInput,
  ReadinessComputeResult,
  RecommendNextLearningInput,
  RecommendNextLearningResult,
  SessionEvalInput,
  SessionEvalResult,
  SystemDesignEvalInput,
  SystemDesignEvalResult,
} from '@interviewos/types'
import {
  behavioralEvalResultSchema,
  conductTurnResultSchema,
  englishFeedbackResultSchema,
  generatedQuestionsResultSchema,
  improveTechnicalNoteResultSchema,
  interviewAnswerResultSchema,
  readinessSnapshotSchema,
  recommendationResultSchema,
  resumeAnalysisResultSchema,
  sessionEvaluationResultSchema,
  systemDesignEvalResultSchema,
  technicalNoteResultSchema,
} from '@interviewos/validators'
import { ZodError, type ZodType } from 'zod'

export class AIResponseValidationError extends Error {
  constructor(
    message: string,
    readonly metadata: AIExecutionMetadata,
  ) {
    super(message)
    this.name = 'AIResponseValidationError'
  }
}

export class AIGateway {
  constructor(private readonly provider: AIProvider) {}

  async generateTechnicalNote(
    input: GenerateTechnicalNoteInput,
  ): Promise<AIResult<GenerateTechnicalNoteResult>> {
    return this.validateResult(
      this.provider.generateTechnicalNote(input),
      technicalNoteResultSchema,
    )
  }

  async improveTechnicalNote(
    input: ImproveTechnicalNoteInput,
  ): Promise<AIResult<ImproveTechnicalNoteResult>> {
    return this.validateResult(
      this.provider.improveTechnicalNote(input),
      improveTechnicalNoteResultSchema,
    )
  }

  async generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<AIResult<GenerateQuestionsFromNoteResult>> {
    return this.validateResult(
      this.provider.generateQuestionsFromNote(input),
      generatedQuestionsResultSchema,
    )
  }

  async evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<AIResult<EvaluateInterviewAnswerResult>> {
    return this.validateResult(
      this.provider.evaluateInterviewAnswer(input),
      interviewAnswerResultSchema,
    )
  }

  async generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<AIResult<GenerateEnglishFeedbackResult>> {
    return this.validateResult(
      this.provider.generateEnglishFeedback(input),
      englishFeedbackResultSchema,
    )
  }

  async recommendNextLearning(
    input: RecommendNextLearningInput,
  ): Promise<AIResult<RecommendNextLearningResult>> {
    return this.validateResult(
      this.provider.recommendNextLearning(input),
      recommendationResultSchema,
    )
  }

  async analyzeResume(input: AnalyzeResumeInput): Promise<AIResult<AnalyzeResumeResult>> {
    return this.validateResult(this.provider.analyzeResume(input), resumeAnalysisResultSchema)
  }

  async conductInterviewTurn(input: ConductTurnInput): Promise<AIResult<ConductTurnResult>> {
    return this.validateResult(this.provider.conductInterviewTurn(input), conductTurnResultSchema)
  }

  async evaluateBehavioralAnswer(input: BehavioralEvalInput): Promise<AIResult<BehavioralEvalResult>> {
    return this.validateResult(this.provider.evaluateBehavioralAnswer(input), behavioralEvalResultSchema)
  }

  async evaluateSystemDesignTurn(input: SystemDesignEvalInput): Promise<AIResult<SystemDesignEvalResult>> {
    return this.validateResult(this.provider.evaluateSystemDesignTurn(input), systemDesignEvalResultSchema)
  }

  async generateSessionEvaluation(input: SessionEvalInput): Promise<AIResult<SessionEvalResult>> {
    return this.validateResult(this.provider.generateSessionEvaluation(input), sessionEvaluationResultSchema)
  }

  async computeReadinessScore(input: ReadinessComputeInput): Promise<AIResult<ReadinessComputeResult>> {
    return this.validateResult(this.provider.computeReadinessScore(input), readinessSnapshotSchema as never)
  }

  private async validateResult<TResult>(
    resultPromise: Promise<AIResult<TResult>>,
    schema: ZodType<TResult>,
  ): Promise<AIResult<TResult>> {
    const response = await resultPromise

    try {
      return {
        result: schema.parse(response.result),
        metadata: {
          ...response.metadata,
          validationStatus: 'success',
        },
      }
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AIResponseValidationError(
          `Structured output validation failed: ${error.message}`,
          {
            ...response.metadata,
            validationStatus: 'validation_failed',
          },
        )
      }

      throw error
    }
  }
}
