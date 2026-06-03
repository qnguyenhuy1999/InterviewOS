import { AIGateway as PackageAIGateway } from '@interviewos/ai'
import type {
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
  RecommendNextLearningInput,
  RecommendNextLearningResult,
} from '@interviewos/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AIGateway {
  constructor(private readonly gateway: PackageAIGateway) {}

  generateTechnicalNote(input: GenerateTechnicalNoteInput): Promise<GenerateTechnicalNoteResult> {
    return this.gateway.generateTechnicalNote(input)
  }

  generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult> {
    return this.gateway.generateQuestionsFromNote(input)
  }

  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult> {
    return this.gateway.evaluateInterviewAnswer(input)
  }

  generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult> {
    return this.gateway.generateEnglishFeedback(input)
  }

  recommendNextLearning(input: RecommendNextLearningInput): Promise<RecommendNextLearningResult> {
    return this.gateway.recommendNextLearning(input)
  }

  analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeResult> {
    return this.gateway.analyzeResume(input)
  }
}
