import type { EvaluationStatus } from './enums'

export interface DimensionScores {
  correctness: number | null
  depth: number | null
  problemSolving: number | null
  clarity: number
  structure: number
  confidence: number
}

export interface StarDimensionScores {
  situation: number
  task: number
  action: number
  result: number
  overall: number
  completeness: 'COMPLETE' | 'MISSING_RESULT' | 'MISSING_ACTION' | 'INCOMPLETE'
}

export interface DesignDimensionScores {
  requirementsGathering: number
  scalability: number
  reliability: number
  tradeoffAnalysis: number
  technologyChoices: number
  architectureDepth: number
}

export interface InterviewEvaluation {
  id: string
  sessionId: string
  status: EvaluationStatus
  overallScore: number | null
  dimensionScores: DimensionScores
  starScores: StarDimensionScores | null
  designScores: DesignDimensionScores | null
  strengths: string[]
  improvements: string[]
  coachingNotes: string[]
  weakConcepts: string[]
  createdAt: Date
  updatedAt: Date
}
