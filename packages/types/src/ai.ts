import { CompanyModeConfig } from './company-mode'
import type {
  EnglishLevel,
  ExperienceLevel,
  ExplanationDepth,
  InterviewType,
  NoteType,
  QuestionDifficulty,
  StarDimension,
  TurnDecision,
  TurnRole,
} from './enums'
import {
  DesignDimensionScores,
  DimensionScores,
  EvaluationEvidence,
  EvaluationRecommendation,
  EvaluationWeakness,
  RubricDimensionScore,
  StarDimensionScores,
} from './evaluation'
import type { TechnicalNoteContent } from './notebook'

export interface GenerateTextInput {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export interface GenerateTextResult {
  text: string
  tokensUsed?: number
}

export interface AITokenUsage {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
}

export type AIValidationStatus = 'success' | 'validation_failed' | 'provider_error'

export interface AIExecutionMetadata {
  provider: string
  model: string
  promptKey: string
  promptVersion: string
  schemaKey: string
  schemaVersion: string
  inputHash: string
  validationStatus: AIValidationStatus
  tokenUsage?: AITokenUsage
  latencyMs: number
  generatedAt: string
}

export interface AIResult<T> {
  result: T
  metadata: AIExecutionMetadata
}

export interface GenerateStructuredInput<T = unknown> {
  prompt: string
  systemPrompt?: string
  schema: T
  temperature?: number
}

export interface GenerateStructuredResult<T = unknown> {
  data: T
  tokensUsed?: number
}

export interface TranscribeAudioInput {
  audioBuffer: Uint8Array
  language?: string
  mimeType?: string
}

export interface TranscribeAudioResult {
  text: string
  duration?: number
}

export interface TextToSpeechInput {
  text: string
  voice?: string
  speed?: number
}

export interface TextToSpeechResult {
  audioBuffer: Uint8Array
  duration?: number
}

export interface GenerateTechnicalNoteInput {
  topic: string
  noteType: NoteType
  targetLevel: ExperienceLevel
  targetRole: string
  englishLevel: EnglishLevel
  techStack?: string[]
  interviewGoals?: string[]
  preferredOutputStyle?: string
  additionalContext?: string
  explanationDepth?: ExplanationDepth
}

export interface GenerateTechnicalNoteResult {
  title: string
  content: TechnicalNoteContent
  sections: Array<{ heading: string; content: string }>
}

export interface ImproveTechnicalNoteInput {
  noteId: string
  title: string
  content: string
  improvementFocus?: string
}

export interface ImproveTechnicalNoteResult {
  title: string
  content: string
  improvements: string[]
}

export interface GenerateQuestionsFromNoteInput {
  noteId: string
  title: string
  content: TechnicalNoteContent
  count?: number
  difficulty?: QuestionDifficulty
}

export interface GenerateQuestionsFromNoteResult {
  questions: Array<{
    question: string
    category: string
    expectedAnswer: string
    difficulty: QuestionDifficulty
    expectedConcepts: string[]
    sourceSection: string
  }>
}

export interface EvaluateInterviewAnswerInput {
  question: string
  answer: string
  expectedConcepts: string[]
  sourceSection: string
  targetLevel: ExperienceLevel
}

export interface EvaluateInterviewAnswerResult {
  technicalScore: number
  englishScore: number
  clarityScore: number
  overallScore: number
  summary: string
  strengths: string[]
  improvements: string[]
  weakConcepts: string[]
  nextRecommendedQuestion: {
    question: string
    difficulty: QuestionDifficulty
    reason: string
  }
  recommendedLearning: {
    title: string
    reason: string
    action: string
  }
}

export interface GenerateEnglishFeedbackInput {
  text: string
  targetLevel: EnglishLevel
}

export interface GenerateEnglishFeedbackResult {
  overallScore: number
  feedback: string
  notes: Array<{
    userSentence: string
    correctedSentence: string
    naturalVersion: string
    explanation: string
    grammarTopic: string
    recommendedTopics: string[]
    practicePatterns: string[]
  }>
  weakTopics: string[]
}

export interface RecommendNextLearningInput {
  userId: string
  currentLevel: ExperienceLevel
  techStack: string[]
  recentTopics: string[]
  weakConcepts: string[]
}

export interface RecommendNextLearningResult {
  recommendations: Array<{
    topic: string
    reason: string
    priority: number
    action: string
  }>
}

export interface AnalyzeResumeInput {
  resumeText: string
  targetRole: string
  targetLevel: ExperienceLevel
}

export interface AnalyzeResumeResult {
  score: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  keySkillsFound: string[]
}

export interface ConductTurnInput {
  sessionType: InterviewType
  userProfile: { level: ExperienceLevel; role: string; stack: string[] }
  conversationHistory: Array<{ role: TurnRole; content: string; turnNumber: number }>
  candidateAnswer: string
  companyModeConfig?: CompanyModeConfig
}

export interface ConductTurnResult {
  decision: TurnDecision
  nextQuestion: string
  reasoning: string
  topicTags: string[]
  references?: Array<{ label: string; value: string }>
  evaluation?: {
    strengths?: string[]
    risks?: string[]
    confidence?: number | null
  }
}

export interface BehavioralEvalInput {
  question: string
  conversation: Array<{ role: TurnRole; content: string }>
}

export interface BehavioralEvalResult {
  starScores: StarDimensionScores
  missingDimensions: StarDimension[]
  followUpQuestion: string | null
  coachingFeedback: string[]
}

export interface SystemDesignEvalInput {
  question: string
  conversation: Array<{ role: TurnRole; content: string }>
  seniorityLevel: ExperienceLevel
}

export interface SystemDesignEvalResult {
  designScores: DesignDimensionScores
  architectureInsights: string[]
  missedConsiderations: string[]
  coachingNotes: string[]
}

export interface SessionEvalInput {
  sessionType: InterviewType
  question: string
  conversation: Array<{ role: TurnRole; content: string }>
  userProfile: { level: ExperienceLevel; role: string }
}

export interface SessionEvalResult {
  overallScore: number
  summary?: string
  confidence?: number
  dimensionScores: DimensionScores
  starScores?: StarDimensionScores
  designScores?: DesignDimensionScores
  rubricScores?: RubricDimensionScore[]
  evidence?: EvaluationEvidence[]
  weaknesses?: EvaluationWeakness[]
  recommendations?: EvaluationRecommendation[]
  strengths: string[]
  improvements: string[]
  coachingNotes: string[]
  weakConcepts: string[]
}

export interface ReadinessComputeInput {
  technicalMastery: number
  interviewPerformance: number
  behavioralPerformance: number
  systemDesignPerformance: number
  englishCommunication: number
  reviewCompletion: number
  learningProgress: number
  sessionCount: number
}

export interface ReadinessComputeResult {
  overallScore: number
  confidenceLevel: number
  breakdown: import('./readiness').ScoreBreakdown[]
  improvementAreas: string[]
}

export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<AIResult<GenerateTextResult>>
  generateStructured<T>(
    input: GenerateStructuredInput<T>,
  ): Promise<AIResult<GenerateStructuredResult<T>>>
  transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioResult>
  textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechResult>
  generateTechnicalNote(
    input: GenerateTechnicalNoteInput,
  ): Promise<AIResult<GenerateTechnicalNoteResult>>
  improveTechnicalNote(
    input: ImproveTechnicalNoteInput,
  ): Promise<AIResult<ImproveTechnicalNoteResult>>
  generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<AIResult<GenerateQuestionsFromNoteResult>>
  conductInterviewTurn(input: ConductTurnInput): Promise<AIResult<ConductTurnResult>>
  evaluateBehavioralAnswer(input: BehavioralEvalInput): Promise<AIResult<BehavioralEvalResult>>
  evaluateSystemDesignTurn(input: SystemDesignEvalInput): Promise<AIResult<SystemDesignEvalResult>>
  generateSessionEvaluation(input: SessionEvalInput): Promise<AIResult<SessionEvalResult>>
  computeReadinessScore(input: ReadinessComputeInput): Promise<AIResult<ReadinessComputeResult>>
  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<AIResult<EvaluateInterviewAnswerResult>>
  generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<AIResult<GenerateEnglishFeedbackResult>>
  recommendNextLearning(
    input: RecommendNextLearningInput,
  ): Promise<AIResult<RecommendNextLearningResult>>
  analyzeResume(input: AnalyzeResumeInput): Promise<AIResult<AnalyzeResumeResult>>
}
