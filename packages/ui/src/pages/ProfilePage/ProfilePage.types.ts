import type {
  ProfileAccountView,
  ProfileLearningProfileView,
  ProfilePageView,
  ProfileResumeInsightView,
  ProfileResumeView,
  ProfileSelectOptionView,
} from '@interviewos/types'

export type ProfilePageProps = {
  loading?: boolean
  empty?: boolean
  error?: string
  profile?: ProfilePageView
}

export type ProfileAccount = ProfileAccountView
export type ProfileLearningProfile = ProfileLearningProfileView
export type ProfileResume = ProfileResumeView
export type ProfileResumeInsight = ProfileResumeInsightView
export type ProfileSelectOption = ProfileSelectOptionView

export type ProfileFixture = ProfilePageView
