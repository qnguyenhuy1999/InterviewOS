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
  roughNotes: z.string().min(1),
  type: z.nativeEnum(NoteType).default(NoteType.CONCEPT),
  advancedSettings: advancedSettingsSchema,
})

export const noteUpdateSchema = noteCreateSchema.partial().extend({
  status: z.nativeEnum(NoteStatus).optional(),
})

export const generateQuestionsSchema = z.object({
  count: z.number().int().min(1).max(10).default(5),
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
})

export type NoteCreateInput = z.infer<typeof noteCreateSchema>
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>
export type GenerateQuestionsInput = z.infer<typeof generateQuestionsSchema>
