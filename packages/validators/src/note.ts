import {
  EnglishLevel,
  ExperienceLevel,
  NoteStatus,
  NoteType,
  QuestionDifficulty,
} from '@interviewos/types'
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
  .nullable()
  .optional()

export const noteCreateSchema = z.object({
  title: z.string().min(1).max(200),
  topic: z.string().trim().max(120).optional().nullable(),
  roughNotes: z.string().min(1),
  type: z.nativeEnum(NoteType).default(NoteType.CONCEPT),
  advancedSettings: advancedSettingsSchema,
})

export const noteUpdateSchema = noteCreateSchema.partial().extend({
  status: z.nativeEnum(NoteStatus).optional(),
})

const csvFieldSchema = z.string().trim()

export const noteFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').max(200, 'Title is too long.'),
    topic: z.string().trim().max(120, 'Topic is too long.'),
    roughNotes: z.string().trim().min(1, 'Rough notes are required.'),
    type: z.nativeEnum(NoteType),
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

export const generateQuestionsSchema = z.object({
  count: z.number().int().min(1).max(10).default(5),
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
})

export type NoteCreateInput = z.infer<typeof noteCreateSchema>
export type NoteFormInput = z.input<typeof noteFormSchema>
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>
export type GenerateQuestionsInput = z.infer<typeof generateQuestionsSchema>

function splitCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
