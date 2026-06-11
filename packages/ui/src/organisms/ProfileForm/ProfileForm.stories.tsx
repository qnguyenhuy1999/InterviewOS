import { EnglishLevel, ExperienceLevel, type UserLearningProfile } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProfileForm } from './ProfileForm'

const profileFixture: UserLearningProfile = {
  id: 'profile-1',
  userId: 'user-1',
  targetRole: 'Senior Frontend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  englishLevel: EnglishLevel.UPPER_INTERMEDIATE,
  techStack: ['TypeScript', 'React', 'Next.js'],
  interviewGoals: ['System design', 'Communication clarity'],
  preferredOutputStyle: 'Concise and practical',
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-10T09:00:00Z'),
}

const meta = {
  title: 'Organisms/ProfileForm',
  component: ProfileForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    initialProfile: profileFixture,
    mode: 'settings',
    onSubmit: async () => {},
  },
} satisfies Meta<typeof ProfileForm>

export default meta
type Story = StoryObj<typeof meta>

export const Settings: Story = {}

export const Onboarding: Story = {
  args: {
    initialProfile: null,
    mode: 'onboarding',
  },
}
