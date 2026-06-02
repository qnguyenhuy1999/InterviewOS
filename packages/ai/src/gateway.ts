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
  GenerateTechnicalNoteInput,
  GenerateTechnicalNoteResult,
  ImproveTechnicalNoteInput,
  ImproveTechnicalNoteResult,
  RecommendNextLearningInput,
  RecommendNextLearningResult,
} from '@interviewos/types'

export class AIGateway {
  constructor(private readonly provider: AIProvider) {}

  generateTechnicalNote(input: GenerateTechnicalNoteInput): Promise<GenerateTechnicalNoteResult> {
    return this.provider.generateTechnicalNote(input)
  }

  improveTechnicalNote(input: ImproveTechnicalNoteInput): Promise<ImproveTechnicalNoteResult> {
    return this.provider.improveTechnicalNote(input)
  }

  generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    return this.provider.generateQuestionsFromNote(input)
  }

  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    return this.provider.evaluateInterviewAnswer(input)
  }

  generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    return this.provider.generateEnglishFeedback(input)
  }

  recommendNextLearning(input: RecommendNextLearningInput): Promise<RecommendNextLearningResult> {
    return this.provider.recommendNextLearning(input)
  }

  analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    return this.provider.analyzeResume(input)
  }
}
