import { createHash } from 'node:crypto'

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
import { QuestionDifficulty } from '@interviewos/types'

import { promptCatalog } from '../prompts'

const MOCK_PROVIDER = 'mock'
const MOCK_MODEL = 'mock-structured-v1'

export class MockAIProvider implements AIProvider {
  async generateText(input: GenerateTextInput): Promise<AIResult<GenerateTextResult>> {
    return withMetadata({ text: 'Mock generated text.', tokensUsed: 10 }, 'text-generation', {
      promptKey: 'text-generation',
      promptVersion: 'v1',
      schemaKey: 'text',
      schemaVersion: 'v1',
      input,
    })
  }

  async generateStructured<T>(
    input: GenerateStructuredInput<T>,
  ): Promise<AIResult<GenerateStructuredResult<T>>> {
    return withMetadata({ data: {} as T, tokensUsed: 10 }, 'structured-generation', {
      promptKey: 'structured-generation',
      promptVersion: 'v1',
      schemaKey: 'structured_response',
      schemaVersion: 'v1',
      input,
    })
  }

  async transcribeAudio(_input: TranscribeAudioInput): Promise<TranscribeAudioResult> {
    return { text: 'Mock transcription.', duration: 5 }
  }

  async textToSpeech(_input: TextToSpeechInput): Promise<TextToSpeechResult> {
    return { audioBuffer: new Uint8Array(0), duration: 1 }
  }

  async generateTechnicalNote(
    input: GenerateTechnicalNoteInput,
  ): Promise<AIResult<GenerateTechnicalNoteResult>> {
    const stack = input.techStack?.join(', ') || 'your current stack'
    return withMetadata(
      {
        title: `Mock: ${input.topic}`,
        content: {
          purpose: `Build interview-ready understanding of ${input.topic} for a ${input.targetRole} role.`,
          quickReference: [
            `${input.topic} is most useful when working with ${stack}.`,
            `Target depth is ${input.targetLevel}.`,
            `Keep explanations concise and ${input.preferredOutputStyle ?? 'practical'}.`,
          ],
          coreConcepts: [
            `${input.topic} fundamentals`,
            `${input.topic} tradeoffs`,
            `${input.topic} production debugging`,
          ],
          mentalModel: `${input.topic} works best when you explain the why, the runtime behavior, and the failure modes together.`,
          productionUsage: [
            `Use ${input.topic} to solve realistic backend/frontend problems.`,
            `Tie the explanation back to ${stack}.`,
          ],
          practicalExamples: [
            `Describe a real feature where ${input.topic} improved maintainability.`,
            `Explain how you would test ${input.topic} under pressure.`,
          ],
          commonPitfalls: [
            `Over-explaining theory without concrete implementation detail.`,
            `Ignoring edge cases and operational tradeoffs.`,
          ],
          debuggingChecklist: [
            `Confirm the problem statement.`,
            `Inspect runtime assumptions.`,
            `State how to verify the fix in production-like conditions.`,
          ],
          productionChecklist: [
            `Define success metrics.`,
            `Handle observability and rollback.`,
            `Document failure scenarios.`,
          ],
          seniorInterviewSignals: [
            `Explicit tradeoff discussion.`,
            `Production-aware debugging mindset.`,
            `Clear communication matched to interviewer context.`,
          ],
        },
        sections: [
          { heading: 'Purpose', content: `Why ${input.topic} matters for ${input.targetRole}.` },
          {
            heading: 'Core Concepts',
            content: `The important mental anchors for ${input.topic}.`,
          },
          {
            heading: 'Production Usage',
            content: `How ${input.topic} shows up in shipped systems.`,
          },
        ],
      },
      'generateTechnicalNote',
      {
        promptKey: promptCatalog.technicalNote,
        promptVersion: 'v1',
        schemaKey: 'technical_note',
        schemaVersion: 'v1',
        input,
      },
    )
  }

  async improveTechnicalNote(
    input: ImproveTechnicalNoteInput,
  ): Promise<AIResult<ImproveTechnicalNoteResult>> {
    return withMetadata(
      {
        title: input.title,
        content: `${input.content}\n\n[Mock improvement added]`,
        improvements: ['Added mock improvement'],
      },
      'improveTechnicalNote',
      {
        promptKey: 'technical-note-improvement',
        promptVersion: 'v1',
        schemaKey: 'technical_note_improvement',
        schemaVersion: 'v1',
        input,
      },
    )
  }

  async generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<AIResult<GenerateQuestionsFromNoteResult>> {
    const sourceSection = input.content.coreConcepts[0] ?? 'Core Concepts'
    return withMetadata(
      {
        questions: [
          {
            question: `Explain ${input.title} to a senior interviewer and describe when you would avoid it.`,
            category: 'Deep Understanding',
            expectedAnswer: 'Mock expected answer.',
            difficulty: input.difficulty ?? QuestionDifficulty.MEDIUM,
            expectedConcepts: input.content.coreConcepts.slice(0, 3),
            sourceSection,
          },
        ],
      },
      'generateQuestionsFromNote',
      {
        promptKey: promptCatalog.generatedQuestions,
        promptVersion: 'v1',
        schemaKey: 'generated_questions',
        schemaVersion: 'v1',
        input,
      },
    )
  }

  async evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<AIResult<EvaluateInterviewAnswerResult>> {
    return withMetadata(
      {
        technicalScore: 78,
        englishScore: 81,
        clarityScore: 80,
        overallScore: 80,
        summary: 'Mock feedback: solid answer, but the explanation needs more production detail.',
        strengths: ['Clear explanation', 'Reasonable structure'],
        improvements: ['Add one concrete example', 'State tradeoffs earlier'],
        weakConcepts: input.expectedConcepts.slice(0, 2),
        nextRecommendedQuestion: {
          question: `What would break first if ${input.sourceSection} was implemented poorly?`,
          difficulty: QuestionDifficulty.HARD,
          reason: 'Pushes the user from conceptual recall into production reasoning.',
        },
        recommendedLearning: {
          title: `${input.sourceSection} review`,
          reason: 'The answer missed depth in the underlying concept area.',
          action: 'Review the note checklist and restate the concept in your own words.',
        },
      },
      'evaluateInterviewAnswer',
      {
        promptKey: promptCatalog.interviewEvaluation,
        promptVersion: 'v1',
        schemaKey: 'interview_evaluation',
        schemaVersion: 'v1',
        input,
      },
    )
  }

  async generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<AIResult<GenerateEnglishFeedbackResult>> {
    return withMetadata(
      {
        overallScore: 80,
        feedback:
          'Mock feedback: understandable and mostly natural, with a few phrases worth tightening.',
        notes: [
          {
            userSentence: input.text.split('.').find(Boolean)?.trim() ?? input.text,
            correctedSentence:
              'I would start by clarifying the tradeoffs before implementing the solution.',
            naturalVersion:
              "I'd first clarify the tradeoffs, then explain how I'd implement it.",
            explanation: 'This version sounds more direct and natural in spoken interviews.',
            grammarTopic: 'Sentence clarity',
            recommendedTopics: ['Concise explanations', 'Transition phrases'],
            practicePatterns: ['I would start by...', 'The tradeoff is that...'],
          },
        ],
        weakTopics: ['Sentence clarity'],
      },
      'generateEnglishFeedback',
      {
        promptKey: promptCatalog.englishFeedback,
        promptVersion: 'v1',
        schemaKey: 'english_feedback',
        schemaVersion: 'v1',
        input,
      },
    )
  }

  async recommendNextLearning(
    input: RecommendNextLearningInput,
  ): Promise<AIResult<RecommendNextLearningResult>> {
    return withMetadata(
      {
        recommendations: [
          {
            topic: 'System Design',
            reason: 'Common interview topic',
            priority: 1,
            action: 'Review one architecture note and answer one follow-up question.',
          },
        ],
      },
      'recommendNextLearning',
      {
        promptKey: promptCatalog.learningRecommendations,
        promptVersion: 'v1',
        schemaKey: 'learning_recommendations',
        schemaVersion: 'v1',
        input,
      },
    )
  }

  async analyzeResume(input: AnalyzeResumeInput): Promise<AIResult<AnalyzeResumeResult>> {
    return withMetadata(
      {
        score: 70,
        strengths: ['Good experience'],
        gaps: ['Missing cloud experience'],
        recommendations: ['Add cloud projects'],
        keySkillsFound: ['TypeScript', 'React'],
      },
      'analyzeResume',
      {
        promptKey: promptCatalog.resumeAnalysis,
        promptVersion: 'v1',
        schemaKey: 'resume_analysis',
        schemaVersion: 'v1',
        input,
      },
    )
  }
}

function withMetadata<TResult>(
  result: TResult,
  _operation: string,
  input: {
    promptKey: string
    promptVersion: string
    schemaKey: string
    schemaVersion: string
    input: unknown
  },
): AIResult<TResult> {
  return {
    result,
    metadata: buildMetadata(input),
  }
}

function buildMetadata(input: {
  promptKey: string
  promptVersion: string
  schemaKey: string
  schemaVersion: string
  input: unknown
}): AIExecutionMetadata {
  return {
    provider: MOCK_PROVIDER,
    model: MOCK_MODEL,
    promptKey: input.promptKey,
    promptVersion: input.promptVersion,
    schemaKey: input.schemaKey,
    schemaVersion: input.schemaVersion,
    inputHash: hashInput(input.input),
    validationStatus: 'success',
    tokenUsage: {
      totalTokens: 10,
    },
    latencyMs: 1,
    generatedAt: new Date().toISOString(),
  }
}

function hashInput(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}
