import { createHash } from 'node:crypto'

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
  GenerateStructuredInput,
  GenerateStructuredResult,
  GenerateTechnicalNoteInput,
  GenerateTechnicalNoteResult,
  GenerateTextInput,
  GenerateTextResult,
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
  TextToSpeechInput,
  TextToSpeechResult,
  TranscribeAudioInput,
  TranscribeAudioResult,
} from '@interviewos/types'

import {
  behavioralEvalPrompt,
  conductTurnPrompt,
  englishFeedbackPrompt,
  generatedQuestionsPrompt,
  improveTechnicalNotePrompt,
  interviewEvaluationPrompt,
  learningRecommendationsPrompt,
  readinessScorePrompt,
  resumeAnalysisPrompt,
  sessionEvaluationPrompt,
  systemDesignEvalPrompt,
  technicalNotePrompt,
} from '../prompts'

type OpenAIProviderOptions = {
  apiKey: string
  baseUrl: string
  model: string
  organization?: string
  project?: string
}

type JsonSchemaFormat = {
  name: string
  schema: Record<string, unknown>
  version: string
}

const structuredSchemaVersion = 'v1'

export class OpenAIProvider implements AIProvider {
  constructor(private readonly options: OpenAIProviderOptions) {}

  async generateText(_input: GenerateTextInput): Promise<AIResult<GenerateTextResult>> {
    throw new Error('Text generation is not used in this phase.')
  }

  async generateStructured<T>(
    input: GenerateStructuredInput<T>,
  ): Promise<AIResult<GenerateStructuredResult<T>>> {
    const result = await this.createStructuredResponse({
      instructions: input.systemPrompt ?? 'Return only valid JSON.',
      prompt: input.prompt,
      format: {
        name: 'structured_response',
        schema: input.schema as Record<string, unknown>,
        version: structuredSchemaVersion,
      },
      promptKey: 'structured-generation',
      promptVersion: 'v1',
    })

    return {
      result: {
        data: result.result as T,
        tokensUsed: result.metadata.tokenUsage?.totalTokens,
      },
      metadata: result.metadata,
    }
  }

  async transcribeAudio(_input: TranscribeAudioInput): Promise<TranscribeAudioResult> {
    throw new Error('Voice features remain out of scope for this phase.')
  }

  async textToSpeech(_input: TextToSpeechInput): Promise<TextToSpeechResult> {
    throw new Error('Voice features remain out of scope for this phase.')
  }

  async generateTechnicalNote(
    input: GenerateTechnicalNoteInput,
  ): Promise<AIResult<GenerateTechnicalNoteResult>> {
    const prompt = technicalNotePrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'technical_note',
        schema: technicalNoteJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async improveTechnicalNote(
    input: ImproveTechnicalNoteInput,
  ): Promise<AIResult<ImproveTechnicalNoteResult>> {
    const prompt = improveTechnicalNotePrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'improve_technical_note',
        schema: improveTechnicalNoteJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<AIResult<GenerateQuestionsFromNoteResult>> {
    const prompt = generatedQuestionsPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'generated_questions',
        schema: generatedQuestionsJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<AIResult<EvaluateInterviewAnswerResult>> {
    const prompt = interviewEvaluationPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'interview_evaluation',
        schema: interviewEvaluationJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<AIResult<GenerateEnglishFeedbackResult>> {
    const prompt = englishFeedbackPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'english_feedback',
        schema: englishFeedbackJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async recommendNextLearning(
    input: RecommendNextLearningInput,
  ): Promise<AIResult<RecommendNextLearningResult>> {
    const prompt = learningRecommendationsPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'learning_recommendations',
        schema: learningRecommendationsJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async conductInterviewTurn(input: ConductTurnInput): Promise<AIResult<ConductTurnResult>> {
    const prompt = conductTurnPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'conduct_turn',
        schema: conductTurnJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async evaluateBehavioralAnswer(
    input: BehavioralEvalInput,
  ): Promise<AIResult<BehavioralEvalResult>> {
    const prompt = behavioralEvalPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'behavioral_eval',
        schema: behavioralEvalJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async evaluateSystemDesignTurn(
    input: SystemDesignEvalInput,
  ): Promise<AIResult<SystemDesignEvalResult>> {
    const prompt = systemDesignEvalPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'system_design_eval',
        schema: systemDesignEvalJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async generateSessionEvaluation(input: SessionEvalInput): Promise<AIResult<SessionEvalResult>> {
    const prompt = sessionEvaluationPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'session_evaluation',
        schema: sessionEvaluationJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async computeReadinessScore(
    input: ReadinessComputeInput,
  ): Promise<AIResult<ReadinessComputeResult>> {
    const prompt = readinessScorePrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'readiness_score',
        schema: readinessScoreJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  async analyzeResume(input: AnalyzeResumeInput): Promise<AIResult<AnalyzeResumeResult>> {
    const prompt = resumeAnalysisPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'resume_analysis',
        schema: resumeAnalysisJsonSchema,
        version: structuredSchemaVersion,
      },
      promptKey: prompt.id,
      promptVersion: prompt.version,
    })
  }

  private async createStructuredResponse<TResult>({
    instructions,
    prompt,
    format,
    promptKey,
    promptVersion,
  }: {
    instructions: string
    prompt: string
    format: JsonSchemaFormat
    promptKey: string
    promptVersion: string
  }): Promise<AIResult<TResult>> {
    const startedAt = Date.now()
    const schemaHint = `\n\nReturn ONLY a valid JSON object. No markdown, no code fences, no text outside the JSON. The response must exactly match this schema:\n${JSON.stringify(format.schema)}`
    const response = await fetch(`${trimTrailingSlash(this.options.baseUrl)}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.options.apiKey}`,
        ...(this.options.organization ? { 'OpenAI-Organization': this.options.organization } : {}),
        ...(this.options.project ? { 'OpenAI-Project': this.options.project } : {}),
      },
      body: JSON.stringify({
        model: this.options.model,
        stream: false,
        instructions: instructions + schemaHint,
        input: prompt,
        text: {
          format: {
            type: 'json_schema',
            name: format.name,
            strict: true,
            schema: format.schema,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`)
    }

    const generatedAt = new Date()
    const payload = (await response.json()) as OpenAICompatiblePayload
    const refusal = payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === 'refusal')

    if (refusal?.type === 'refusal') {
      throw new Error(`OpenAI refused the request: ${refusal.refusal}`)
    }

    const structuredResult = extractStructuredResult(payload)
    if (structuredResult === undefined) {
      throw new Error('OpenAI response did not include structured output text.')
    }

    return {
      result: structuredResult as TResult,
      metadata: buildMetadata({
        provider: 'openai',
        model: this.options.model,
        promptKey,
        promptVersion,
        schemaKey: format.name,
        schemaVersion: format.version,
        input: { instructions, prompt, schema: format.schema },
        usage: payload.usage,
        generatedAt,
        latencyMs: Date.now() - startedAt,
      }),
    }
  }
}

type OpenAIResponsesPayload = {
  output_parsed?: unknown
  output_text?: string
  usage?: {
    input_tokens?: number
    output_tokens?: number
    total_tokens?: number
  }
  output?: Array<{
    content?: Array<
      | {
          type: 'output_text'
          text: string
          parsed?: unknown
        }
      | {
          type: 'output_json'
          json: unknown
        }
      | {
          type: 'refusal'
          refusal: string
        }
    >
  }>
}

type OpenAIChatCompletionPayload = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

type OpenAICompatiblePayload = OpenAIResponsesPayload & OpenAIChatCompletionPayload

function extractStructuredResult(payload: OpenAICompatiblePayload): unknown | undefined {
  if (payload.output_parsed !== undefined) {
    return unwrapStructuredPayload(payload.output_parsed)
  }

  const parsedContent = payload.output
    ?.flatMap((item) => item.content ?? [])
    .find(
      (
        content,
      ): content is
        | {
            type: 'output_text'
            text: string
            parsed?: unknown
          }
        | {
            type: 'output_json'
            json: unknown
          } =>
        (content.type === 'output_text' && content.parsed !== undefined) ||
        (content.type === 'output_json' && content.json !== undefined),
    )

  if (parsedContent?.type === 'output_text') {
    return unwrapStructuredPayload(parsedContent.parsed)
  }

  if (parsedContent?.type === 'output_json') {
    return unwrapStructuredPayload(parsedContent.json)
  }

  const outputText =
    payload.output_text ?? extractOutputText(payload.output) ?? extractChatCompletionText(payload)

  if (!outputText) {
    return undefined
  }

  try {
    return unwrapStructuredPayload(JSON.parse(outputText))
  } catch {
    throw new Error('AI response contained malformed JSON')
  }
}

function extractOutputText(output: OpenAIResponsesPayload['output']): string | undefined {
  return output
    ?.flatMap((item) => item.content ?? [])
    .find(
      (
        content,
      ): content is {
        type: 'output_text'
        text: string
      } => content.type === 'output_text' && typeof content.text === 'string',
    )?.text
}

function extractChatCompletionText(payload: OpenAIChatCompletionPayload): string | undefined {
  return payload.choices?.find((choice) => typeof choice.message?.content === 'string')?.message
    ?.content
}

function unwrapStructuredPayload(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }

  if ('data' in value) {
    return unwrapStructuredPayload(value.data)
  }

  if (
    'content' in value &&
    typeof value.content === 'string' &&
    !('title' in value) &&
    !('sections' in value)
  ) {
    try {
      return unwrapStructuredPayload(JSON.parse(value.content))
    } catch {
      return value
    }
  }

  return value
}

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function withVersion(prompt: { id: string; version: string; instructions: string }) {
  return `[Prompt ${prompt.id}@${prompt.version}]\n${prompt.instructions}`
}

function buildMetadata(input: {
  provider: string
  model: string
  promptKey: string
  promptVersion: string
  schemaKey: string
  schemaVersion: string
  input: unknown
  usage?: OpenAICompatiblePayload['usage']
  generatedAt: Date
  latencyMs: number
}): AIExecutionMetadata {
  return {
    provider: input.provider,
    model: input.model,
    promptKey: input.promptKey,
    promptVersion: input.promptVersion,
    schemaKey: input.schemaKey,
    schemaVersion: input.schemaVersion,
    inputHash: createHash('sha256').update(JSON.stringify(input.input)).digest('hex'),
    validationStatus: 'success',
    tokenUsage: {
      inputTokens:
        'input_tokens' in (input.usage ?? {})
          ? input.usage?.input_tokens
          : input.usage?.prompt_tokens,
      outputTokens:
        'output_tokens' in (input.usage ?? {})
          ? input.usage?.output_tokens
          : input.usage?.completion_tokens,
      totalTokens: input.usage?.total_tokens,
    },
    latencyMs: input.latencyMs,
    generatedAt: input.generatedAt.toISOString(),
  }
}

const sharedStringArray = { type: 'array', items: { type: 'string' } } as const

const improveTechnicalNoteJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'content', 'improvements'],
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    improvements: { type: 'array', items: { type: 'string' } },
  },
} as const

const technicalNoteJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'content', 'sections'],
  properties: {
    title: { type: 'string' },
    content: {
      type: 'object',
      additionalProperties: false,
      required: [
        'purpose',
        'quickReference',
        'coreConcepts',
        'mentalModel',
        'productionUsage',
        'practicalExamples',
        'commonPitfalls',
        'debuggingChecklist',
        'productionChecklist',
        'seniorInterviewSignals',
      ],
      properties: {
        purpose: { type: 'string' },
        quickReference: sharedStringArray,
        coreConcepts: sharedStringArray,
        mentalModel: { type: 'string' },
        productionUsage: sharedStringArray,
        practicalExamples: sharedStringArray,
        commonPitfalls: sharedStringArray,
        debuggingChecklist: sharedStringArray,
        productionChecklist: sharedStringArray,
        seniorInterviewSignals: sharedStringArray,
      },
    },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['heading', 'content'],
        properties: {
          heading: { type: 'string' },
          content: { type: 'string' },
        },
      },
    },
  },
} as const

const generatedQuestionsJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'question',
          'category',
          'expectedAnswer',
          'difficulty',
          'expectedConcepts',
          'sourceSection',
        ],
        properties: {
          question: { type: 'string' },
          category: { type: 'string' },
          expectedAnswer: { type: 'string' },
          difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD', 'EXPERT'] },
          expectedConcepts: sharedStringArray,
          sourceSection: { type: 'string' },
        },
      },
    },
  },
} as const

const interviewEvaluationJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'technicalScore',
    'englishScore',
    'clarityScore',
    'overallScore',
    'summary',
    'strengths',
    'improvements',
    'weakConcepts',
    'nextRecommendedQuestion',
    'recommendedLearning',
  ],
  properties: {
    technicalScore: { type: 'integer' },
    englishScore: { type: 'integer' },
    clarityScore: { type: 'integer' },
    overallScore: { type: 'integer' },
    summary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    improvements: { type: 'array', items: { type: 'string' } },
    weakConcepts: { type: 'array', items: { type: 'string' } },
    nextRecommendedQuestion: {
      type: 'object',
      additionalProperties: false,
      required: ['question', 'difficulty', 'reason'],
      properties: {
        question: { type: 'string' },
        difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD', 'EXPERT'] },
        reason: { type: 'string' },
      },
    },
    recommendedLearning: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'reason', 'action'],
      properties: {
        title: { type: 'string' },
        reason: { type: 'string' },
        action: { type: 'string' },
      },
    },
  },
} as const

const englishFeedbackJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['overallScore', 'feedback', 'notes', 'weakTopics'],
  properties: {
    overallScore: { type: 'integer' },
    feedback: { type: 'string' },
    notes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'userSentence',
          'correctedSentence',
          'naturalVersion',
          'explanation',
          'grammarTopic',
          'recommendedTopics',
          'practicePatterns',
        ],
        properties: {
          userSentence: { type: 'string' },
          correctedSentence: { type: 'string' },
          naturalVersion: { type: 'string' },
          explanation: { type: 'string' },
          grammarTopic: { type: 'string' },
          recommendedTopics: { type: 'array', items: { type: 'string' } },
          practicePatterns: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    weakTopics: { type: 'array', items: { type: 'string' } },
  },
} as const

const learningRecommendationsJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['recommendations'],
  properties: {
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['topic', 'reason', 'priority', 'action'],
        properties: {
          topic: { type: 'string' },
          reason: { type: 'string' },
          priority: { type: 'integer' },
          action: { type: 'string' },
        },
      },
    },
  },
} as const

const resumeAnalysisJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['score', 'strengths', 'gaps', 'recommendations', 'keySkillsFound'],
  properties: {
    score: { type: 'integer' },
    strengths: { type: 'array', items: { type: 'string' } },
    gaps: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: { type: 'string' } },
    keySkillsFound: { type: 'array', items: { type: 'string' } },
  },
} as const

const conductTurnJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['decision', 'nextQuestion', 'reasoning', 'topicTags'],
  properties: {
    decision: {
      type: 'string',
      enum: [
        'FOLLOW_UP',
        'DEEP_DIVE',
        'CLARIFY',
        'CHALLENGE',
        'ESCALATE',
        'ADVANCE',
        'WRAP_UP',
        'EVALUATE',
      ],
    },
    nextQuestion: { type: 'string' },
    reasoning: { type: 'string' },
    topicTags: { type: 'array', items: { type: 'string' } },
  },
} as const

const scoreProps = { type: 'number' } as const
const behavioralEvalJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['starScores', 'missingDimensions', 'followUpQuestion', 'coachingFeedback'],
  properties: {
    starScores: {
      type: 'object',
      additionalProperties: false,
      required: ['situation', 'task', 'action', 'result', 'overall', 'completeness'],
      properties: {
        situation: scoreProps,
        task: scoreProps,
        action: scoreProps,
        result: scoreProps,
        overall: scoreProps,
        completeness: {
          type: 'string',
          enum: ['COMPLETE', 'MISSING_RESULT', 'MISSING_ACTION', 'INCOMPLETE'],
        },
      },
    },
    missingDimensions: { type: 'array', items: { type: 'string' } },
    followUpQuestion: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    coachingFeedback: { type: 'array', items: { type: 'string' } },
  },
} as const

const systemDesignEvalJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['designScores', 'architectureInsights', 'missedConsiderations', 'coachingNotes'],
  properties: {
    designScores: {
      type: 'object',
      additionalProperties: false,
      required: [
        'requirementsGathering',
        'scalability',
        'reliability',
        'tradeoffAnalysis',
        'technologyChoices',
        'architectureDepth',
      ],
      properties: {
        requirementsGathering: scoreProps,
        scalability: scoreProps,
        reliability: scoreProps,
        tradeoffAnalysis: scoreProps,
        technologyChoices: scoreProps,
        architectureDepth: scoreProps,
      },
    },
    architectureInsights: { type: 'array', items: { type: 'string' } },
    missedConsiderations: { type: 'array', items: { type: 'string' } },
    coachingNotes: { type: 'array', items: { type: 'string' } },
  },
} as const

const sessionEvaluationJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'overallScore',
    'dimensionScores',
    'strengths',
    'improvements',
    'coachingNotes',
    'weakConcepts',
  ],
  properties: {
    overallScore: { type: 'integer' },
    dimensionScores: {
      type: 'object',
      additionalProperties: false,
      required: ['correctness', 'depth', 'problemSolving', 'clarity', 'structure', 'confidence'],
      properties: {
        correctness: scoreProps,
        depth: scoreProps,
        problemSolving: scoreProps,
        clarity: scoreProps,
        structure: scoreProps,
        confidence: scoreProps,
      },
    },
    strengths: { type: 'array', items: { type: 'string' } },
    improvements: { type: 'array', items: { type: 'string' } },
    coachingNotes: { type: 'array', items: { type: 'string' } },
    weakConcepts: { type: 'array', items: { type: 'string' } },
  },
} as const

const readinessScoreJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['overallScore', 'confidenceLevel', 'breakdown', 'improvementAreas'],
  properties: {
    overallScore: { type: 'integer' },
    confidenceLevel: { type: 'number' },
    breakdown: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['dimension', 'score', 'weight', 'label', 'trend'],
        properties: {
          dimension: { type: 'string' },
          score: scoreProps,
          weight: scoreProps,
          label: { type: 'string' },
          trend: { type: 'string', enum: ['UP', 'DOWN', 'STABLE'] },
        },
      },
    },
    improvementAreas: { type: 'array', items: { type: 'string' } },
  },
} as const
