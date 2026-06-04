import type { AnalyzeResumeResult } from './ai'
import type { ExperienceLevel } from './enums'

export interface ResumeAnalysis extends AnalyzeResumeResult {
  id: string
  userId: string
  resumeText: string
  targetRole: string
  targetLevel: ExperienceLevel
  fileName: string | null
  analyzedAt: Date | string
}
