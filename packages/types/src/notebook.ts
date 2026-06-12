import type {
  EnglishLevel,
  ExperienceLevel,
  NoteStatus,
  NoteType,
  QuestionDifficulty,
} from './enums'

export interface TechnicalNote {
  id: string
  userId: string
  title: string
  topic: string | null
  rawInput: string
  type: NoteType
  status: NoteStatus
  overrideRole: string | null
  overrideLevel: ExperienceLevel | null
  overrideStack: string[]
  overrideGoals: string[]
  overrideEnglishLevel: EnglishLevel | null
  preferredOutputStyle: string | null
  structuredContent: TechnicalNoteContent | null
  createdAt: Date
  updatedAt: Date
}

export interface NotebookNoteListItem extends TechnicalNote {
  questionCount: number
  difficulty: QuestionDifficulty
}

export interface AdvancedLearningSettings {
  targetRole?: string
  targetLevel?: ExperienceLevel
  englishLevel?: EnglishLevel
  techStack?: string[]
  interviewGoals?: string[]
  preferredOutputStyle?: string
}

export interface TechnicalNoteContentSection {
  heading: string
  content: string
}

export interface TechnicalNoteContent {
  purpose: string
  quickReference: string[]
  coreConcepts: string[]
  mentalModel: string
  productionUsage: string[]
  practicalExamples: string[]
  commonPitfalls: string[]
  debuggingChecklist: string[]
  productionChecklist: string[]
  seniorInterviewSignals: string[]
  // Extended depth fields (present on notes generated after depth expansion)
  directAnswer?: string
  deepTheory?: string
  internals?: string[]
  edgeCases?: string[]
  tradeoffs?: string[]
  commonMistakes?: string[]
  interviewFollowUps?: string[]
  summary?: string
}

export interface TechnicalNoteSection {
  id: string
  noteId: string
  heading: string
  content: string
  order: number
}

export interface NoteGeneratedQuestion {
  id: string
  noteId: string
  question: string
  category: string
  expectedAnswer: string | null
  difficulty: QuestionDifficulty
  expectedConcepts: string[]
  sourceSection: string
}

export interface TechnicalNoteSummary {
  id: string
  title: string
  topic: string | null
  type: NoteType
  status: NoteStatus
  updatedAt: Date
  questionCount: number
}

export interface TechnicalNoteDetailView {
  note: TechnicalNote
  questionCount: number
  generatedQuestions: NoteGeneratedQuestion[]
  relatedNotes: TechnicalNoteSummary[]
}

export interface CreateTechnicalNoteInput {
  title: string
  topic?: string | null
  roughNotes: string
  type?: NoteType
  advancedSettings?: AdvancedLearningSettings
}

export interface UpdateTechnicalNoteInput extends Partial<CreateTechnicalNoteInput> {
  status?: NoteStatus
}

export interface GenerateTechnicalNoteRequest {
  noteId: string
}

export interface GenerateQuestionsFromNoteRequest {
  count?: number
  difficulty?: QuestionDifficulty
}
