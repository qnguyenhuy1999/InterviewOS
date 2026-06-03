import type {
  AIProvider,
  AnalyzeResumeInput,
  AnalyzeResumeResult,
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
  RecommendNextLearningInput,
  RecommendNextLearningResult,
  TextToSpeechInput,
  TextToSpeechResult,
  TranscribeAudioInput,
  TranscribeAudioResult,
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

import {
  englishFeedbackPrompt,
  generatedQuestionsPrompt,
  interviewEvaluationPrompt,
  learningRecommendationsPrompt,
  resumeAnalysisPrompt,
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
}

export class OpenAIProvider implements AIProvider {
  constructor(private readonly options: OpenAIProviderOptions) {}

  async generateText(_input: GenerateTextInput): Promise<GenerateTextResult> {
    throw new Error('Text generation is not used in this phase.')
  }

  async generateStructured<T>(
    input: GenerateStructuredInput<T>,
  ): Promise<GenerateStructuredResult<T>> {
    const result = await this.createStructuredResponse({
      instructions: input.systemPrompt ?? 'Return only valid JSON.',
      prompt: input.prompt,
      format: {
        name: 'structured_response',
        schema: input.schema as Record<string, unknown>,
      },
      validator: null,
    })

    return {
      data: result.data as T,
      tokensUsed: result.tokensUsed,
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
  ): Promise<GenerateTechnicalNoteResult> {
    const prompt = technicalNotePrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'technical_note',
        schema: technicalNoteJsonSchema,
      },
      validator: technicalNoteResultSchema,
    }).then((result) => result.data as GenerateTechnicalNoteResult)
  }

  async improveTechnicalNote(
    input: ImproveTechnicalNoteInput,
  ): Promise<ImproveTechnicalNoteResult> {
    return {
      title: input.title,
      content: input.content,
      improvements: ['No automatic improvement flow is configured in this phase.'],
    }
  }

  async generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    const prompt = generatedQuestionsPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'generated_questions',
        schema: generatedQuestionsJsonSchema,
      },
      validator: generatedQuestionsResultSchema,
    }).then((result) => result.data as GenerateQuestionsFromNoteResult)
  }

  async evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    const prompt = interviewEvaluationPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'interview_evaluation',
        schema: interviewEvaluationJsonSchema,
      },
      validator: interviewAnswerResultSchema,
    }).then((result) => result.data as EvaluateInterviewAnswerResult)
  }

  async generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    const prompt = englishFeedbackPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'english_feedback',
        schema: englishFeedbackJsonSchema,
      },
      validator: englishFeedbackResultSchema,
    }).then((result) => result.data as GenerateEnglishFeedbackResult)
  }

  async recommendNextLearning(
    input: RecommendNextLearningInput,
  ): Promise<RecommendNextLearningResult> {
    const prompt = learningRecommendationsPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'learning_recommendations',
        schema: learningRecommendationsJsonSchema,
      },
      validator: recommendationResultSchema,
    }).then((result) => result.data as RecommendNextLearningResult)
  }

  async analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    const prompt = resumeAnalysisPrompt(input)
    return this.createStructuredResponse({
      instructions: withVersion(prompt),
      prompt: prompt.prompt,
      format: {
        name: 'resume_analysis',
        schema: resumeAnalysisJsonSchema,
      },
      validator: resumeAnalysisResultSchema,
    }).then((result) => result.data as AnalyzeResumeResult)
  }

  private async createStructuredResponse<T>({
    instructions,
    prompt,
    format,
    validator,
  }: {
    instructions: string
    prompt: string
    format: JsonSchemaFormat
    validator: ZodType<T> | null
  }): Promise<{ data: T; tokensUsed?: number }> {
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
        instructions,
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
      throw new Error(`OpenAI request failed with status ${response.status}: ${await response.text()}`)
    }

    const payload = (await response.json()) as OpenAIResponsesPayload
    const refusal = payload.output?.flatMap((item) => item.content ?? []).find(
      (content) => content.type === 'refusal',
    )

    if (refusal?.type === 'refusal') {
      throw new Error(`OpenAI refused the request: ${refusal.refusal}`)
    }

    const outputText = payload.output_text ?? extractOutputText(payload.output)
    if (!outputText) {
      throw new Error('OpenAI response did not include structured output text.')
    }

    const parsed = JSON.parse(outputText) as unknown

    try {
      return {
        data: validator ? validator.parse(parsed) : (parsed as T),
        tokensUsed: payload.usage?.total_tokens,
      }
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Structured output validation failed: ${error.message}`)
      }
      throw error instanceof Error ? error : new Error('Structured output validation failed.')
    }
  }
}

type OpenAIResponsesPayload = {
  output_text?: string
  usage?: {
    total_tokens?: number
  }
  output?: Array<{
    content?: Array<
      | {
          type: 'output_text'
          text: string
        }
      | {
          type: 'refusal'
          refusal: string
        }
    >
  }>
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

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function withVersion(prompt: { id: string; version: string; instructions: string }) {
  return `[Prompt ${prompt.id}@${prompt.version}]\n${prompt.instructions}`
}

const sharedStringArray = { type: 'array', items: { type: 'string' }, minItems: 1 } as const

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
