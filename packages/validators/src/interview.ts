import { EnglishLevel, ExperienceLevel } from '@interviewos/types'
import { splitCommaSeparated } from '@interviewos/utils'
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

const csvFieldSchema = z.string().trim()

export const interviewAnswerFormSchema = z
  .object({
    answer: z.string().trim().min(1, 'Answer is required.'),
    advancedEnabled: z.boolean().default(false),
    targetRole: z.string().trim(),
    targetLevel: z.nativeEnum(ExperienceLevel),
    englishLevel: z.nativeEnum(EnglishLevel),
    techStack: csvFieldSchema,
    interviewGoals: csvFieldSchema,
    preferredOutputStyle: z.string().trim(),
  })
  .superRefine((value, context) => {
    if (!value.advancedEnabled) {
      return
    }

    if (!value.targetRole) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetRole'],
        message: 'Target role is required when overrides are enabled.',
      })
    }

    if (splitCommaSeparated(value.techStack).length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['techStack'],
        message: 'Enter at least one tech stack item.',
      })
    }

    if (splitCommaSeparated(value.interviewGoals).length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['interviewGoals'],
        message: 'Enter at least one interview goal.',
      })
    }

    if (!value.preferredOutputStyle) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['preferredOutputStyle'],
        message: 'Preferred output style is required when overrides are enabled.',
      })
    }
  })

export type StartInterviewSessionInput = z.infer<typeof startInterviewSessionSchema>
export type InterviewAnswerInput = z.infer<typeof interviewAnswerSchema>
export type InterviewAnswerFormInput = z.input<typeof interviewAnswerFormSchema>
