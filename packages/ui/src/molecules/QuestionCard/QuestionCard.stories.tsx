import { QuestionDifficulty } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import QuestionCard from './QuestionCard'
import { answerFixtures, questionFixtures } from './QuestionCard.fixtures'

const meta = {
  title: 'Molecules/QuestionCard',
  component: QuestionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithAnswer: Story = {
  args: {
    question: questionFixtures[0],
    answer: answerFixtures[0],
  },
}

export const WithoutAnswer: Story = {
  args: {
    question: questionFixtures[1],
  },
}

export const Loading: Story = {
  args: {
    question: questionFixtures[0],
    loading: true,
  },
}

export const AllDifficulties: Story = {
  args: { question: questionFixtures[0] },
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.values(QuestionDifficulty).map((diff, i) => (
        <QuestionCard
          key={diff}
          question={{
            id: `q-${diff}`,
            sessionId: 'session-001',
            question: `Sample ${diff.toLowerCase()} question about system design and software architecture.`,
            difficulty: diff,
            order: i + 1,
          }}
        />
      ))}
    </div>
  ),
}

export const WithHighScore: Story = {
  args: {
    question: questionFixtures[0],
    answer: { ...answerFixtures[0], score: 95 },
  },
}

export const WithLowScore: Story = {
  args: {
    question: questionFixtures[0],
    answer: { ...answerFixtures[0], score: 42 },
  },
}
