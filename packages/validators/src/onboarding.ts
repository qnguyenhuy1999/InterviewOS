import { EnglishLevel, ExperienceLevel } from '@interviewos/types'
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

export type OnboardingInput = z.infer<typeof onboardingSchema>
