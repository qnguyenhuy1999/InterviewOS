import type { EnglishLevel, QuestionDifficulty } from './enums'

export type SettingsSectionId =
  | 'profile'
  | 'learning_preferences'
  | 'english_level'
  | 'interview_preferences'
  | 'ai_provider'
  | 'account'

export type SettingsActionIntent = 'primary' | 'secondary' | 'destructive'

export interface SettingsSelectOptionView {
  value: string
  label: string
}

export interface SettingsActionView {
  id: string
  label: string
  intent: SettingsActionIntent
}

interface SettingsFieldBase {
  id: string
  label: string
  description?: string
}

export interface SettingsInputFieldView extends SettingsFieldBase {
  kind: 'input'
  value: string
  inputType: 'text' | 'email' | 'password' | 'number'
}

export interface SettingsSelectFieldView extends SettingsFieldBase {
  kind: 'select'
  value: string
  options: SettingsSelectOptionView[]
}

export interface SettingsToggleFieldView extends SettingsFieldBase {
  kind: 'toggle'
  checked: boolean
}

export interface SettingsValueFieldView extends SettingsFieldBase {
  kind: 'value'
  value: string
}

export interface SettingsActionFieldView extends SettingsFieldBase {
  kind: 'actions'
  actions: SettingsActionView[]
}

export type SettingsFieldView =
  | SettingsInputFieldView
  | SettingsSelectFieldView
  | SettingsToggleFieldView
  | SettingsValueFieldView
  | SettingsActionFieldView

export interface SettingsSectionView {
  id: SettingsSectionId
  label: string
  title: string
  description: string
  fields: SettingsFieldView[]
  footerActions?: SettingsActionView[]
}

export interface SettingsPageView {
  title: string
  subtitle: string
  sections: SettingsSectionView[]
}

export interface SettingsProfileView {
  fullName: string
  email: string
  targetRole: string
}

export interface LearningPreferencesView {
  dailyGoal: string
  dailyGoalOptions: SettingsSelectOptionView[]
  surfaceWeakTopicsFirst: boolean
  weeklyDigestEnabled: boolean
}

export interface EnglishLevelPreferencesView {
  currentLevel: EnglishLevel
  levelOptions: SettingsSelectOptionView[]
  showPronunciationTips: boolean
  aggressiveGrammarCorrection: boolean
}

export interface InterviewPreferencesView {
  defaultDifficulty: QuestionDifficulty
  difficultyOptions: SettingsSelectOptionView[]
  defaultQuestionCount: string
  questionCountOptions: SettingsSelectOptionView[]
  timePerQuestionSeconds: number
}

export interface AIProviderPreferencesView {
  provider: string
  providerOptions: SettingsSelectOptionView[]
  apiKeyMasked: string
}

export interface AccountPreferencesView {
  planLabel: string
}
