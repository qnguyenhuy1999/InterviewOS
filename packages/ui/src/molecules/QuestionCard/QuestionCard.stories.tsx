import type { Meta, StoryObj } from '@storybook/react-vite'

import { QuestionCard } from './QuestionCard'

const meta = {
  title: 'Molecules/QuestionCard',
  component: QuestionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Molecules/How would you design a rate limiter for an API?',
    description: 'Discuss request shape, storage, burst handling, and failure modes.',
    difficulty: 'medium',
    badges: ['Backend', 'System design'],
    footer: 'Follow up: explain how you would test the limiter under load.',
  },
} satisfies Meta<typeof QuestionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Easy: Story = {
  args: {
    difficulty: 'easy',
    title: 'Molecules/What is the difference between props and state?',
    badges: ['Fundamentals'],
  },
}

export const Hard: Story = {
  args: {
    difficulty: 'hard',
    title: 'Molecules/Design a multi-region live collaboration system with conflict resolution.',
    badges: ['Architecture', 'Scaling', 'Tradeoffs'],
  },
}

export const Minimal: Story = {
  args: {
    description: undefined,
    badges: [],
    footer: undefined,
    difficulty: 'medium',
    title: 'Molecules/Explain useEffect cleanup timing.',
  },
}
