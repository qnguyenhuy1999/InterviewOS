import type {
  ResumeAnalysisAttributeView,
  ResumeFileView,
  ResumePageView,
  ResumeSuggestedTopicView,
  ResumeUploadAreaView,
} from '@interviewos/types'
import type React from 'react'

export type ResumePageProps = {
  data?: ResumePageView
  loading?: boolean
  empty?: boolean
  error?: string
  renderUploadArea?: React.ReactNode
  emptyAction?: React.ReactNode
}

export type ResumeCurrentFile = ResumeFileView
export type ResumeAnalysisAttribute = ResumeAnalysisAttributeView
export type ResumeUploadArea = ResumeUploadAreaView
export type ResumeSuggestedTopic = ResumeSuggestedTopicView

export type ResumePageFixture = ResumePageView
