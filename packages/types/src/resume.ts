import type { ExperienceLevel } from './enums'

export interface ResumeAnalysis {
  id: string
  userId: string
  resumeText: string
  score: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  keySkillsFound: string[]
  targetRole: string
  targetLevel: ExperienceLevel
  analyzedAt: Date
}
