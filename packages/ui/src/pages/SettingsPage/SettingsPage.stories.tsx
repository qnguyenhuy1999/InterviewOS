import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import SettingsPage from './SettingsPage'
import { settingsPageFixture } from './SettingsPage.fixtures'

const meta = {
  title: 'Pages/SettingsPage',
  component: SettingsPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    data: settingsPageFixture,
    activeSectionId: 'profile',
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Settings">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LearningPreferences: Story = {
  args: { activeSectionId: 'learning_preferences' },
}

export const EnglishLevel: Story = {
  args: { activeSectionId: 'english_level' },
}

export const InterviewPreferences: Story = {
  args: { activeSectionId: 'interview_preferences' },
}

export const AIProvider: Story = {
  args: { activeSectionId: 'ai_provider' },
}

export const Account: Story = {
  args: { activeSectionId: 'account' },
}

export const ErrorState: Story = {
  args: {
    error: 'Unable to load settings right now.',
    retryHref: '/settings',
  },
}
