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

export interface ResumeUploadAreaView {
  title: string
  description: string
  supportedFormatsLabel: string
  actionLabel: string
}

export interface ResumeFileView {
  id: string
  fileName: string
  metadataLabel: string
  actionLabel: string
}

export interface ResumeSectionView<TItem> {
  title: string
  subtitle: string
  actionLabel: string
  items: TItem[]
}

export interface ResumeAnalysisAttributeView {
  label: string
  value: string
}

export interface ResumeSuggestedTopicView {
  id: string
  title: string
  actionLabel: string
}

export interface ResumeEmptyStateView {
  title: string
  description: string
  actionLabel: string
}

export interface ResumePageView {
  title: string
  subtitle: string
  upload: ResumeUploadAreaView
  currentResume: ResumeSectionView<ResumeFileView>
  analysis: ResumeSectionView<ResumeAnalysisAttributeView>
  strengths: ResumeSectionView<string>
  gaps: ResumeSectionView<string>
  improvements: ResumeSectionView<string>
  extractedSkills: ResumeSectionView<string>
  suggestedTopics: ResumeSectionView<ResumeSuggestedTopicView>
  missingKeywords?: ResumeSectionView<string> | null
  bulletRewriteSuggestions?: ResumeSectionView<string> | null
  interviewPreparation?: ResumeSectionView<string> | null
  emptyState: ResumeEmptyStateView
}
