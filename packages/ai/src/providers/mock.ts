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
    return {
      title: `Mock: ${input.topic}`,
      content: 'Mock technical note content.',
      sections: [{ heading: 'Overview', content: 'Mock section content.' }],
      tags: [input.topic.toLowerCase()],
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
    _input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    return {
      questions: [
        {
          question: 'Mock question about the topic?',
          expectedAnswer: 'Mock expected answer.',
          difficulty: QuestionDifficulty.MEDIUM,
        },
      ],
    }
  }

  async evaluateInterviewAnswer(
    _input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    return {
      score: 75,
      feedback: 'Mock feedback: Good answer overall.',
      strengths: ['Clear explanation'],
      improvements: ['Add more examples'],
    }
  }

  async generateEnglishFeedback(
    _input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    return {
      overallScore: 80,
      feedback: 'Mock feedback: Good English.',
      grammarIssues: [],
      vocabularyNotes: ['Consider using more varied vocabulary'],
    }
  }

  async recommendNextLearning(
    _input: RecommendNextLearningInput,
  ): Promise<RecommendNextLearningResult> {
    return {
      recommendations: [{ topic: 'System Design', reason: 'Common interview topic', priority: 1 }],
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
