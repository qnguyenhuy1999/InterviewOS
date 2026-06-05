import type { ExperienceLevel } from './enums'

export interface ProfileSelectOptionView<T extends string = string> {
  value: T
  label: string
}

export interface ProfileFieldView {
  label: string
  value: string
}

export interface ProfileTagFieldView {
  label: string
  items: string[]
  inputPlaceholder: string
}

export interface ProfileAccountView {
  title: string
  name: ProfileFieldView
  email: ProfileFieldView
  isEmailVerified: boolean
  verifiedLabel: string
}

export interface ProfileLearningProfileView {
  title: string
  description: string
  targetRole: ProfileFieldView
  currentLevel: {
    label: string
    value: ExperienceLevel
  }
  preferredOutputStyle: ProfileFieldView
  techStack: ProfileTagFieldView
  interviewGoals: ProfileTagFieldView
}

export interface ProfileResumeUploadView {
  dropzoneTitle: string
  dropzoneDescription: string
  ctaLabel: string
  acceptedFileTypes: string[]
  maxFileSizeMb: number
}

export interface ProfileResumeInsightView {
  fileName: string
  uploadedLabel: string
  strengths: string[]
  gaps: string[]
  keySkills: string[]
  recommendations: string[]
}

export interface ProfileResumeView {
  title: string
  description: string
  upload: ProfileResumeUploadView
  latest: ProfileResumeInsightView | null
}

export interface ProfilePageView {
  title: string
  subtitle: string
  account: ProfileAccountView
  learningProfile: ProfileLearningProfileView
  resume: ProfileResumeView
  currentLevelOptions: ProfileSelectOptionView<ExperienceLevel>[]
  preferredOutputStyleOptions: ProfileSelectOptionView[]
}
