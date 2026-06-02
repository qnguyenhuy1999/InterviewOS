import type { EnglishLevel, ExperienceLevel, NoteType, QuestionDifficulty } from './enums'

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
  techStack?: string[]
  additionalContext?: string
}

export interface GenerateTechnicalNoteResult {
  title: string
  content: string
  sections: Array<{ heading: string; content: string }>
  tags: string[]
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
  content: string
  count?: number
  difficulty?: QuestionDifficulty
}

export interface GenerateQuestionsFromNoteResult {
  questions: Array<{
    question: string
    expectedAnswer: string
    difficulty: QuestionDifficulty
  }>
}

export interface EvaluateInterviewAnswerInput {
  question: string
  answer: string
  expectedAnswer?: string
  targetLevel: ExperienceLevel
}

export interface EvaluateInterviewAnswerResult {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

export interface GenerateEnglishFeedbackInput {
  text: string
  targetLevel: EnglishLevel
}

export interface GenerateEnglishFeedbackResult {
  overallScore: number
  feedback: string
  grammarIssues: Array<{ original: string; suggestion: string; explanation: string }>
  vocabularyNotes: string[]
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
