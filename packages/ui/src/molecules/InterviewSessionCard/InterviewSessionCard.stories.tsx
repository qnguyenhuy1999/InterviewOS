import { InterviewType } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import InterviewSessionCard from './InterviewSessionCard'
import { interviewSessionFixtures } from './InterviewSessionCard.fixtures'

const meta = {
  title: 'Molecules/InterviewSessionCard',
  component: InterviewSessionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof InterviewSessionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Completed: Story = {
  args: {
    session: interviewSessionFixtures.technical,
    questionsAnswered: 3,
    totalQuestions: 3,
    averageScore: 79,
    onReview: () => {},
  },
}

export const InProgress: Story = {
  args: {
    session: interviewSessionFixtures.inProgress,
    questionsAnswered: 1,
    totalQuestions: 3,
    onResume: () => {},
  },
}

export const Fresh: Story = {
  args: {
    session: interviewSessionFixtures.inProgress,
    questionsAnswered: 0,
    totalQuestions: 3,
    onResume: () => {},
  },
}

export const Loading: Story = {
  args: {
    session: interviewSessionFixtures.technical,
    loading: true,
  },
}

export const AllTypes: Story = {
  args: { session: interviewSessionFixtures.technical },
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.values(InterviewType).map((type) => (
        <InterviewSessionCard
          key={type}
          session={{
            id: `session-${type}`,
            userId: 'user-001',
            interviewType: type,
            startedAt: new Date('2025-06-01'),
            endedAt: new Date('2025-06-01'),
          }}
          questionsAnswered={2}
          totalQuestions={3}
          averageScore={75}
        />
      ))}
    </div>
  ),
}
