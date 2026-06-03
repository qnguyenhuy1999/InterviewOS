import { EnglishLevel, ExperienceLevel } from '@interviewos/types'
import { z } from 'zod'

const advancedSettingsSchema = z
  .object({
    targetRole: z.string().min(1).optional(),
    targetLevel: z.nativeEnum(ExperienceLevel).optional(),
    englishLevel: z.nativeEnum(EnglishLevel).optional(),
    techStack: z.array(z.string().min(1)).optional(),
    interviewGoals: z.array(z.string().min(1)).optional(),
    preferredOutputStyle: z.string().min(1).optional(),
  })
  .optional()

export const startInterviewSessionSchema = z.object({
  generatedQuestionId: z.string().min(1),
})

export const interviewAnswerSchema = z.object({
  answer: z.string().min(1),
  advancedSettings: advancedSettingsSchema,
})

export type StartInterviewSessionInput = z.infer<typeof startInterviewSessionSchema>
export type InterviewAnswerInput = z.infer<typeof interviewAnswerSchema>
