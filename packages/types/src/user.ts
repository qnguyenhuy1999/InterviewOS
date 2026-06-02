import type { EnglishLevel, ExperienceLevel } from './enums'

export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserLearningProfile {
  id: string
  userId: string
  targetRole: string
  currentLevel: ExperienceLevel
  targetLevel: ExperienceLevel
  englishLevel: EnglishLevel
  techStack: string[]
  interviewGoals: string[]
  preferredOutputStyle: string
  createdAt: Date
  updatedAt: Date
}
