import type { CompanyMode } from './company-mode'
import type { EnglishLevel, ExperienceLevel, InterviewType, NoteStatus, QuestionDifficulty } from './enums'
import type { InterviewEvaluation } from './evaluation'
import type { AdvancedLearningSettings } from './notebook'

export interface InterviewSession {
  id: string
  userId: string
  type: InterviewType
  status: NoteStatus
  noteId: string | null
  sourceQuestionId: string | null
  overrideRole: string | null
  overrideLevel: ExperienceLevel | null
  overrideStack: string[]
  overrideGoals: string[]
  overrideEnglishLevel: EnglishLevel | null
  preferredOutputStyle: string | null
  mode?: 'STANDARD' | 'MULTI_TURN' | 'COMPANY'
  companyModeId?: string | null
  parentSessionId?: string | null
  version?: number
  maxTurns?: number
  currentTurnNum?: number
  lastActivityAt?: Date | null
  contextSnapshot?: Record<string, unknown> | null
  startedAt: Date | null
  endedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface InterviewSummary {
  id: string
  sessionId: string
  generatedFromVersion: number
  headline: string
  keyTakeaways: string[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  transcript: Array<{
    turnNumber: number
    role: 'INTERVIEWER' | 'CANDIDATE'
    content: string
    decision?: string | null
  }> | null
  createdAt: Date
  updatedAt: Date
}

export interface InterviewReadinessImpact {
  id: string
  sessionId: string
  userId: string
  overallDelta: number
  technicalDelta: number
  behavioralDelta: number
  systemDesignDelta: number
  communicationDelta: number
  consistencyDelta: number
  snapshot: Record<string, unknown> | null
  createdAt: Date
}

export interface InterviewSessionDetail extends InterviewSession {
  note?: { title: string | null } | null
  companyMode?: CompanyMode | null
  evaluation?: InterviewEvaluation | null
  summary?: InterviewSummary | null
  readinessImpact?: InterviewReadinessImpact | null
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
  advancedSettings?: AdvancedLearningSettings
}
