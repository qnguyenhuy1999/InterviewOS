import { EnglishLevel, ExperienceLevel } from '@interviewos/types'
import { splitCommaSeparated } from '@interviewos/utils'
import { z } from 'zod'

export const onboardingSchema = z.object({
  targetRole: z.string().min(1),
  currentLevel: z.nativeEnum(ExperienceLevel),
  targetLevel: z.nativeEnum(ExperienceLevel),
  englishLevel: z.nativeEnum(EnglishLevel),
  techStack: z.array(z.string()).min(1),
  interviewGoals: z.array(z.string()).min(1),
  preferredOutputStyle: z.string().min(1),
})

const csvFieldSchema = z
  .string()
  .trim()
  .refine((value) => splitCommaSeparated(value).length > 0, 'Enter at least one item.')

export const profileUpdateSchema = z.object({
  targetRole: z.string().trim().min(1, 'Target role is required.'),
  currentLevel: z.nativeEnum(ExperienceLevel),
  targetLevel: z.nativeEnum(ExperienceLevel),
  englishLevel: z.nativeEnum(EnglishLevel),
  techStack: csvFieldSchema,
  interviewGoals: csvFieldSchema,
  preferredOutputStyle: z.string().trim().min(1, 'Preferred output style is required.'),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
export type ProfileUpdateInput = z.input<typeof profileUpdateSchema>
