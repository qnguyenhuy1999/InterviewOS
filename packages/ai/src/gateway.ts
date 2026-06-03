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
import {
  englishFeedbackResultSchema,
  generatedQuestionsResultSchema,
  interviewAnswerResultSchema,
  recommendationResultSchema,
  resumeAnalysisResultSchema,
  technicalNoteResultSchema,
} from '@interviewos/validators'

export class AIGateway {
  constructor(private readonly provider: AIProvider) {}

  generateTechnicalNote(input: GenerateTechnicalNoteInput): Promise<GenerateTechnicalNoteResult> {
    return this.provider.generateTechnicalNote(input).then((result) =>
      technicalNoteResultSchema.parse(result),
    )
  }

  improveTechnicalNote(input: ImproveTechnicalNoteInput): Promise<ImproveTechnicalNoteResult> {
    return this.provider.improveTechnicalNote(input)
  }

  generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    return this.provider.generateQuestionsFromNote(input).then((result) =>
      generatedQuestionsResultSchema.parse(result),
    )
  }

  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    return this.provider.evaluateInterviewAnswer(input).then((result) =>
      interviewAnswerResultSchema.parse(result),
    )
  }

  generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    return this.provider.generateEnglishFeedback(input).then((result) =>
      englishFeedbackResultSchema.parse(result),
    )
  }

  recommendNextLearning(input: RecommendNextLearningInput): Promise<RecommendNextLearningResult> {
    return this.provider.recommendNextLearning(input).then((result) =>
      recommendationResultSchema.parse(result),
    )
  }

  analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    return this.provider.analyzeResume(input).then((result) =>
      resumeAnalysisResultSchema.parse(result),
    )
  }
}
