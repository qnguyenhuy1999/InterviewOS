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
  TechnicalNoteContent,
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
    const response = await this.provider.generateTechnicalNote(input)

    return this.validateValue(
      {
        ...response,
        result: normalizeTechnicalNoteResult(response.result),
      },
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
    return this.validateValue(response, schema)
  }

  private validateValue<TResult>(response: AIResult<TResult>, schema: ZodType<TResult>): AIResult<TResult> {
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

function normalizeTechnicalNoteResult(result: GenerateTechnicalNoteResult): GenerateTechnicalNoteResult {
  return {
    ...result,
    content: normalizeTechnicalNoteContent(result.content),
  }
}

function normalizeTechnicalNoteContent(content: TechnicalNoteContent): TechnicalNoteContent {
  const purpose = ensureString(content.purpose)
  const mentalModel = ensureString(content.mentalModel)
  const coreConcepts = ensureStringArray(content.coreConcepts)
  const productionUsage = ensureStringArray(content.productionUsage)
  const commonPitfalls = ensureStringArray(content.commonPitfalls)
  const productionChecklist = ensureStringArray(content.productionChecklist)
  const seniorInterviewSignals = ensureStringArray(content.seniorInterviewSignals)

  const summary = content.summary?.trim() || purpose
  const directAnswer =
    content.directAnswer?.trim() ||
    [purpose, mentalModel, productionChecklist[0]]
      .filter(Boolean)
      .join(' ')
      .trim()
  const deepTheory =
    content.deepTheory?.trim() ||
    [
      mentalModel,
      sentenceFromList('Key internals include', coreConcepts),
      sentenceFromList('In production, this matters because', productionUsage),
    ]
      .filter(Boolean)
      .join(' ')
      .trim()

  return {
    ...content,
    purpose,
    mentalModel,
    coreConcepts,
    productionUsage,
    commonPitfalls,
    productionChecklist,
    seniorInterviewSignals,
    summary,
    directAnswer,
    deepTheory,
    internals: ensureItems(content.internals, coreConcepts),
    edgeCases: ensureItems(content.edgeCases, commonPitfalls),
    tradeoffs: ensureItems(content.tradeoffs, seniorInterviewSignals),
    commonMistakes: ensureItems(content.commonMistakes, commonPitfalls),
    interviewFollowUps: ensureItems(
      content.interviewFollowUps,
      seniorInterviewSignals.map((signal) => `How would you apply ${signal.toLowerCase()} in production?`),
    ),
  }
}

function ensureItems(primary: string[] | undefined, fallback: string[]): string[] {
  const normalizedPrimary = primary?.map((item) => item.trim()).filter(Boolean) ?? []
  if (normalizedPrimary.length > 0) {
    return normalizedPrimary
  }

  return fallback.map((item) => item.trim()).filter(Boolean).slice(0, 3)
}

function sentenceFromList(prefix: string, items: string[]): string {
  const normalized = items.map((item) => item.trim()).filter(Boolean)
  if (normalized.length === 0) {
    return ''
  }

  return `${prefix} ${normalized.join('; ')}.`
}

function ensureString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function ensureStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
    : []
}
