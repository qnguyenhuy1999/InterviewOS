import type { Meta, StoryObj } from '@storybook/react-vite'

import { InterviewQuestionCard } from '../InterviewQuestionCard'

const meta = {
  title: 'Molecules/InterviewQuestionCard',
  component: InterviewQuestionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    question: 'How would you design a rate limiter for an API?',
    category: 'system-design',
    difficulty: 'medium',
    tags: ['Backend', 'System design'],
    timeEstimate: 15,
  },
} satisfies Meta<typeof InterviewQuestionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = {
  args: { variant: 'compact' },
}

export const Expanded: Story = {
  args: { variant: 'expanded' },
}

export const Active: Story = {
  args: { variant: 'active', isActive: true },
}

export const Easy: Story = {
  args: {
    difficulty: 'easy',
    question: 'What is the difference between props and state?',
    category: 'technical',
    tags: ['Fundamentals'],
  },
}

export const Medium: Story = {
  args: {
    difficulty: 'medium',
    question: 'How would you implement debouncing in JavaScript?',
    category: 'technical',
    tags: ['Performance'],
  },
}

export const Hard: Story = {
  args: {
    difficulty: 'hard',
    question: 'Design a multi-region live collaboration system with conflict resolution.',
    category: 'system-design',
    tags: ['Architecture', 'Scaling', 'Tradeoffs'],
  },
}

export const LongQuestion: Story = {
  args: {
    question:
      'Tell me about a time when you had to make a critical technical decision under tight deadlines with incomplete information. How did you approach the problem, align stakeholders, and handle the outcome?',
    category: 'behavioral',
    difficulty: 'medium',
  },
}

export const WithTags: Story = {
  args: {
    variant: 'expanded',
    tags: ['React', 'Hooks', 'Performance', 'Memoization', 'Rendering'],
  },
}

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, width: 480 }}>
      <InterviewQuestionCard {...args} variant="compact" />
      <InterviewQuestionCard {...args} variant="expanded" />
      <InterviewQuestionCard {...args} variant="active" isActive />
    </div>
  ),
}
