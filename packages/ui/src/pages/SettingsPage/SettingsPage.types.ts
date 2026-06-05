import type { SettingsPageView, SettingsSectionId, SettingsSectionView } from '@interviewos/types'

export type SettingsPageProps = {
  data?: SettingsPageView
  activeSectionId?: SettingsSectionId
  loading?: boolean
  empty?: boolean
  error?: string
  onSectionChange?: (sectionId: SettingsSectionId) => void
}

export type SettingsPageFixture = SettingsPageView
export type SettingsPageSection = SettingsSectionView
