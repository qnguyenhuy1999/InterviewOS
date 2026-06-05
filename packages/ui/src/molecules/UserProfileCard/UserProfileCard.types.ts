import type { ExperienceLevel as ExperienceLevelType } from '@interviewos/types'

export type User = {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export type LearningProfile = {
  id: string
  userId: string
  targetRole: string
  currentLevel: ExperienceLevelType
  targetLevel: ExperienceLevelType
  techStack: string[]
  interviewGoals: string[]
  englishLevel: string
  preferredOutputStyle: string
  createdAt: Date
  updatedAt: Date
}

export type UserProfileCardProps = {
  user: User
  profile?: LearningProfile
  loading?: boolean
  onEdit?: () => void
}
