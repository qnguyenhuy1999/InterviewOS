import { StarDimension } from '@interviewos/types'
import { z } from 'zod'

const dimensionScoresSchema = z.object({
  correctness: z.number().min(0).max(10).nullable(),
  depth: z.number().min(0).max(10).nullable(),
  problemSolving: z.number().min(0).max(10).nullable(),
  clarity: z.number().min(0).max(10),
  structure: z.number().min(0).max(10),
  confidence: z.number().min(0).max(10),
})

const evidenceSchema = z.object({
  quote: z.string().min(1),
  rationale: z.string().min(1),
  turnNumber: z.number().int().positive().nullable().optional(),
})

const weaknessSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

const recommendationSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  priority: z.enum(['NOW', 'NEXT', 'LATER']),
})

const rubricDimensionScoreSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  score: z.number().min(0).max(100),
  evidence: z.array(z.string().min(1)),
})

export const starScoresSchema = z.object({
  situation: z.number().min(0).max(10),
  task: z.number().min(0).max(10),
  action: z.number().min(0).max(10),
  result: z.number().min(0).max(10),
  overall: z.number().min(0).max(10),
  completeness: z.enum(['COMPLETE', 'MISSING_RESULT', 'MISSING_ACTION', 'INCOMPLETE']),
})

export const designScoresSchema = z.object({
  requirementsGathering: z.number().min(0).max(10),
  scalability: z.number().min(0).max(10),
  reliability: z.number().min(0).max(10),
  tradeoffAnalysis: z.number().min(0).max(10),
  technologyChoices: z.number().min(0).max(10),
  architectureDepth: z.number().min(0).max(10),
})

export const sessionEvaluationResultSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  summary: z.string().min(1).optional(),
  confidence: z.number().int().min(0).max(100).optional(),
  dimensionScores: dimensionScoresSchema,
  rubricScores: z.array(rubricDimensionScoreSchema).optional(),
  evidence: z.array(evidenceSchema).optional(),
  weaknesses: z.array(weaknessSchema).optional(),
  recommendations: z.array(recommendationSchema).optional(),
  strengths: z.array(z.string().min(1)),
  improvements: z.array(z.string().min(1)),
  coachingNotes: z.array(z.string().min(1)),
  weakConcepts: z.array(z.string().min(1)),
})

export const behavioralEvalResultSchema = z.object({
  starScores: starScoresSchema,
  missingDimensions: z.array(z.nativeEnum(StarDimension)),
  followUpQuestion: z.string().nullable(),
  coachingFeedback: z.array(z.string().min(1)),
})

export const systemDesignEvalResultSchema = z.object({
  designScores: designScoresSchema,
  architectureInsights: z.array(z.string().min(1)),
  missedConsiderations: z.array(z.string().min(1)),
  coachingNotes: z.array(z.string().min(1)),
})
