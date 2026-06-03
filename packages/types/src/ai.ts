import type { EnglishLevel, ExperienceLevel, NoteType, QuestionDifficulty } from './enums'
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

export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>
  generateStructured<T>(input: GenerateStructuredInput<T>): Promise<GenerateStructuredResult<T>>
  transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioResult>
  textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechResult>
  generateTechnicalNote(input: GenerateTechnicalNoteInput): Promise<GenerateTechnicalNoteResult>
  improveTechnicalNote(input: ImproveTechnicalNoteInput): Promise<ImproveTechnicalNoteResult>
  generateQuestionsFromNote(
    input: GenerateQuestionsFromNoteInput,
  ): Promise<GenerateQuestionsFromNoteResult>
  evaluateInterviewAnswer(
    input: EvaluateInterviewAnswerInput,
  ): Promise<EvaluateInterviewAnswerResult>
  generateEnglishFeedback(
    input: GenerateEnglishFeedbackInput,
  ): Promise<GenerateEnglishFeedbackResult>
  recommendNextLearning(input: RecommendNextLearningInput): Promise<RecommendNextLearningResult>
  analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeResult>
}
