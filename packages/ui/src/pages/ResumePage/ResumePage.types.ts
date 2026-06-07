import type {
  ResumeAnalysisAttributeView,
  ResumeFileView,
  ResumePageView,
  ResumeSuggestedTopicView,
  ResumeUploadAreaView,
} from '@interviewos/types'

export type ResumePageProps = {
  data?: ResumePageView
  loading?: boolean
  empty?: boolean
  error?: string
}

export type ResumeCurrentFile = ResumeFileView
export type ResumeAnalysisAttribute = ResumeAnalysisAttributeView
export type ResumeUploadArea = ResumeUploadAreaView
export type ResumeSuggestedTopic = ResumeSuggestedTopicView

export type ResumePageFixture = ResumePageView
