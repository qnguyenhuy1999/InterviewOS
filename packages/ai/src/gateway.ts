import type {
  AIExecutionMetadata,
  AIProvider,
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
  ImproveTechnicalNoteInput,
  ImproveTechnicalNoteResult,
  RecommendNextLearningInput,
  RecommendNextLearningResult,
} from '@interviewos/types'
import {
  englishFeedbackResultSchema,
  generatedQuestionsResultSchema,
  interviewAnswerResultSchema,
  recommendationResultSchema,
  resumeAnalysisResultSchema,
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
    return this.provider.improveTechnicalNote(input)
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
