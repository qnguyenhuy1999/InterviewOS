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
import { QuestionDifficulty } from '@interviewos/types'

export class MockAIProvider implements AIProvider {
  async generateText(_input: GenerateTextInput): Promise<GenerateTextResult> {
    return { text: 'Mock generated text.', tokensUsed: 10 }
  }

  async generateStructured<T>(
    _input: GenerateStructuredInput<T>,
  ): Promise<GenerateStructuredResult<T>> {
    return { data: {} as T, tokensUsed: 10 }
  }

  async transcribeAudio(_input: TranscribeAudioInput): Promise<TranscribeAudioResult> {
    return { text: 'Mock transcription.', duration: 5 }
  }

  async textToSpeech(_input: TextToSpeechInput): Promise<TextToSpeechResult> {
    return { audioBuffer: new Uint8Array(0), duration: 1 }
  }

  async generateTechnicalNote(
    input: GenerateTechnicalNoteInput,
  ): Promise<GenerateTechnicalNoteResult> {
    const stack = input.techStack?.join(', ') || 'your current stack'
    return {
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
        { heading: 'Core Concepts', content: `The important mental anchors for ${input.topic}.` },
        { heading: 'Production Usage', content: `How ${input.topic} shows up in shipped systems.` },
      ],
    }
  }

  async improveTechnicalNote(
    input: ImproveTechnicalNoteInput,
  ): Promise<ImproveTechnicalNoteResult> {
    return {
      title: input.title,
      content: `${input.content}\n\n[Mock improvement added]`,
      improvements: ['Added mock improvement'],
    }
  }

  async generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    const sourceSection = input.content.coreConcepts[0] ?? 'Core Concepts'
    return {
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
    }
  }

  async evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    return {
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
    }
  }

  async generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    return {
      overallScore: 80,
      feedback:
        'Mock feedback: understandable and mostly natural, with a few phrases worth tightening.',
      notes: [
        {
          userSentence: input.text.split('.').find(Boolean)?.trim() ?? input.text,
          correctedSentence:
            'I would start by clarifying the tradeoffs before implementing the solution.',
          naturalVersion: 'I’d first clarify the tradeoffs, then explain how I’d implement it.',
          explanation: 'This version sounds more direct and natural in spoken interviews.',
          grammarTopic: 'Sentence clarity',
          recommendedTopics: ['Concise explanations', 'Transition phrases'],
          practicePatterns: ['I would start by...', 'The tradeoff is that...'],
        },
      ],
      weakTopics: ['Sentence clarity'],
    }
  }

  async recommendNextLearning(
    _input: RecommendNextLearningInput,
  ): Promise<RecommendNextLearningResult> {
    return {
      recommendations: [
        {
          topic: 'System Design',
          reason: 'Common interview topic',
          priority: 1,
          action: 'Review one architecture note and answer one follow-up question.',
        },
      ],
    }
  }

  async analyzeResume(_input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    return {
      score: 70,
      strengths: ['Good experience'],
      gaps: ['Missing cloud experience'],
      recommendations: ['Add cloud projects'],
      keySkillsFound: ['TypeScript', 'React'],
    }
  }
}
