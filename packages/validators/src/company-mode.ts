import { QuestionDifficulty } from '@interviewos/types'
import { z } from 'zod'

export const companyModeConfigSchema = z.object({
  interviewerPersona: z.string().min(1),
  difficultyProfile: z.object({
    startingDifficulty: z.nativeEnum(QuestionDifficulty),
    escalationRate: z.enum(['SLOW', 'MEDIUM', 'FAST']),
    maxDifficulty: z.nativeEnum(QuestionDifficulty),
  }),
  followUpBehavior: z.object({
    maxFollowUpsPerQuestion: z.number().int().min(0).max(10),
    challengeThreshold: z.number().min(0).max(1),
    clarificationThreshold: z.number().min(0).max(1),
  }),
  evaluationCriteria: z.object({
    weights: z.record(z.number().min(0).max(1)),
    rubric: z.string().min(1),
  }),
  feedbackStyle: z.enum(['DIRECT', 'COACHING', 'SOCRATIC']),
  questionBank: z.array(z.string().min(1)).optional(),
  emphasis: z
    .object({
      communication: z.number().min(0).max(1).optional(),
      ownership: z.number().min(0).max(1).optional(),
      technicalDepth: z.number().min(0).max(1).optional(),
      productThinking: z.number().min(0).max(1).optional(),
      architecture: z.number().min(0).max(1).optional(),
    })
    .optional(),
  interviewStyle: z
    .object({
      probingDepth: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      expectedPace: z.enum(['STEADY', 'FAST']).optional(),
      prefersBreadth: z.boolean().optional(),
    })
    .optional(),
})
