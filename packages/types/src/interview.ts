import type { InterviewType, NoteStatus, QuestionDifficulty } from './enums'

export interface InterviewSession {
  id: string
  userId: string
  type: InterviewType
  status: NoteStatus
  noteId: string | null
  sourceQuestionId: string | null
  startedAt: Date | null
  endedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface InterviewQuestion {
  id: string
  sessionId: string
  question: string
  category: string
  difficulty: QuestionDifficulty
  order: number
  expectedConcepts: string[]
  sourceSection: string
  topicTags: string[]
}

export interface InterviewAnswer {
  id: string
  questionId: string
  rawAnswer: string
  technicalScore: number | null
  englishScore: number | null
  clarityScore: number | null
  overallScore: number | null
  aiFeedback: string | null
  technicalFeedback: TechnicalFeedback | null
  englishFeedback: InterviewEnglishFeedback | null
  nextRecommendedQuestion: NextRecommendedQuestion | null
  recommendedLearning: RecommendedLearningItem | null
  weakConcepts: string[]
  createdAt: Date
}

export interface TechnicalFeedback {
  summary: string
  strengths: string[]
  improvements: string[]
}

export interface InterviewEnglishFeedback {
  summary: string
  overallScore: number
  notesCreated: number
  highlightedTopics: string[]
}

export interface NextRecommendedQuestion {
  question: string
  difficulty: QuestionDifficulty
  reason: string
}

export interface RecommendedLearningItem {
  title: string
  reason: string
  action: string
}

export interface StartInterviewSessionInput {
  generatedQuestionId: string
}

export interface SubmitInterviewAnswerInput {
  answer: string
}
