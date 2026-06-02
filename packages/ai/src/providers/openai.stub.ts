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

const NOT_IMPLEMENTED = new Error('OpenAI provider not yet implemented')

export class OpenAIProvider implements AIProvider {
  async generateText(_input: GenerateTextInput): Promise<GenerateTextResult> {
    throw NOT_IMPLEMENTED
  }

  async generateStructured<T>(
    _input: GenerateStructuredInput<T>,
  ): Promise<GenerateStructuredResult<T>> {
    throw NOT_IMPLEMENTED
  }

  async transcribeAudio(_input: TranscribeAudioInput): Promise<TranscribeAudioResult> {
    throw NOT_IMPLEMENTED
  }

  async textToSpeech(_input: TextToSpeechInput): Promise<TextToSpeechResult> {
    throw NOT_IMPLEMENTED
  }

  async generateTechnicalNote(
    _input: GenerateTechnicalNoteInput,
  ): Promise<GenerateTechnicalNoteResult> {
    throw NOT_IMPLEMENTED
  }

  async improveTechnicalNote(
    _input: ImproveTechnicalNoteInput,
  ): Promise<ImproveTechnicalNoteResult> {
    throw NOT_IMPLEMENTED
  }

  async generateQuestionsFromNote(
    _input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    throw NOT_IMPLEMENTED
  }

  async evaluateInterviewAnswer(
    _input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    throw NOT_IMPLEMENTED
  }

  async generateEnglishFeedback(
    _input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    throw NOT_IMPLEMENTED
  }

  async recommendNextLearning(
    _input: RecommendNextLearningInput,
  ): Promise<RecommendNextLearningResult> {
    throw NOT_IMPLEMENTED
  }

  async analyzeResume(_input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    throw NOT_IMPLEMENTED
  }
}
