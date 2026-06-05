import type { Meta, StoryObj } from '@storybook/react-vite'

import SettingsPage from './SettingsPage'
import { settingsPageFixture } from './SettingsPage.fixtures'

const meta = {
  title: 'Pages/SettingsPage',
  component: SettingsPage,
  args: {
    data: settingsPageFixture,
    activeSectionId: 'profile',
  },
} satisfies Meta<typeof SettingsPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LearningPreferences: Story = {
  args: {
    activeSectionId: 'learning_preferences',
  },
}

export const EnglishLevel: Story = {
  args: {
    activeSectionId: 'english_level',
  },
}

export const InterviewPreferences: Story = {
  args: {
    activeSectionId: 'interview_preferences',
  },
}

export const AIProvider: Story = {
  args: {
    activeSectionId: 'ai_provider',
  },
}

export const Account: Story = {
  args: {
    activeSectionId: 'account',
  },
}
