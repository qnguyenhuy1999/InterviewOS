import type { SettingsSectionId } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BrainCircuitIcon,
  Building2Icon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  UserIcon,
  UserRoundIcon,
} from 'lucide-react'
import type * as React from 'react'

import { SettingsSectionNav } from './SettingsSectionNav'

const profileIcon = ({ className }: { className?: string }) => (
  <UserRoundIcon className={className} />
)
const learningPreferencesIcon = ({ className }: { className?: string }) => (
  <GraduationCapIcon className={className} />
)
const englishLevelIcon = ({ className }: { className?: string }) => (
  <BrainCircuitIcon className={className} />
)
const interviewPreferencesIcon = ({ className }: { className?: string }) => (
  <LayoutDashboardIcon className={className} />
)
const aiProviderIcon = ({ className }: { className?: string }) => (
  <Building2Icon className={className} />
)
const accountIcon = ({ className }: { className?: string }) => <UserIcon className={className} />

const iconMap: Record<SettingsSectionId, React.ComponentType<{ className?: string }>> = {
  profile: profileIcon,
  learning_preferences: learningPreferencesIcon,
  english_level: englishLevelIcon,
  interview_preferences: interviewPreferencesIcon,
  ai_provider: aiProviderIcon,
  account: accountIcon,
}

const meta = {
  title: 'Organisms/SettingsSectionNav',
  component: SettingsSectionNav,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    activeSectionId: 'profile',
    sections: [
      {
        id: 'profile',
        label: 'Profile',
        title: 'Organisms/Profile',
        description: 'User identity',
        fields: [],
      },
      {
        id: 'learning_preferences',
        label: 'Learning Preferences',
        title: 'Organisms/Learning preferences',
        description: 'Study cadence and goals',
        fields: [],
      },
      {
        id: 'english_level',
        label: 'English Level',
        title: 'Organisms/English level',
        description: 'Language support settings',
        fields: [],
      },
    ],
    iconMap,
  },
} satisfies Meta<typeof SettingsSectionNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FullMenu: Story = {
  args: {
    activeSectionId: 'ai_provider',
    sections: [
      {
        id: 'profile',
        label: 'Profile',
        title: 'Organisms/Profile',
        description: 'User identity',
        fields: [],
      },
      {
        id: 'learning_preferences',
        label: 'Learning Preferences',
        title: 'Organisms/Learning preferences',
        description: 'Study cadence and goals',
        fields: [],
      },
      {
        id: 'english_level',
        label: 'English Level',
        title: 'Organisms/English level',
        description: 'Language support settings',
        fields: [],
      },
      {
        id: 'interview_preferences',
        label: 'Interview Preferences',
        title: 'Organisms/Interview preferences',
        description: 'Questioning defaults',
        fields: [],
      },
      {
        id: 'ai_provider',
        label: 'AI Provider',
        title: 'Organisms/AI provider',
        description: 'Model connection settings',
        fields: [],
      },
      {
        id: 'account',
        label: 'Account',
        title: 'Organisms/Account',
        description: 'Plan and access',
        fields: [],
      },
    ],
  },
}

export const ActiveAccount: Story = {
  args: {
    activeSectionId: 'account',
  },
}
