import {
  EnglishLevel,
  ExperienceLevel,
  type UserLearningProfile,
} from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { InterviewAnswerForm } from './InterviewAnswerForm'

const profileFixture: UserLearningProfile = {
  id: 'profile-1',
  userId: 'user-1',
  targetRole: 'Senior Frontend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  englishLevel: EnglishLevel.UPPER_INTERMEDIATE,
  techStack: ['TypeScript', 'React', 'Next.js'],
  interviewGoals: ['System design', 'Concise communication'],
  preferredOutputStyle: 'Brief and practical',
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-10T09:00:00Z'),
}

const meta = {
  title: 'Organisms/InterviewAnswerForm',
  component: InterviewAnswerForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    session: {
      overrideRole: null,
      overrideLevel: null,
      overrideStack: [],
      overrideGoals: [],
      overrideEnglishLevel: null,
      preferredOutputStyle: null,
    },
    profile: profileFixture,
    onSubmit: async () => {},
  },
} satisfies Meta<typeof InterviewAnswerForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithOverrides: Story = {
  args: {
    session: {
      overrideRole: 'Staff Frontend Engineer',
      overrideLevel: ExperienceLevel.SENIOR,
      overrideStack: ['React', 'Performance tuning'],
      overrideGoals: ['Architecture depth', 'Leadership stories'],
      overrideEnglishLevel: EnglishLevel.ADVANCED,
      preferredOutputStyle: 'Detailed with tradeoffs',
    },
  },
}
