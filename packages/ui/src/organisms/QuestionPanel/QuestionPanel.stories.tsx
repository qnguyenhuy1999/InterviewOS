import type { Meta, StoryObj } from '@storybook/react-vite'

import { QuestionPanel } from './QuestionPanel'

const QUESTIONS = [
  {
    id: 'q1',
    question: 'Tell me about a time you led a cross-functional project under tight deadlines.',
    category: 'behavioral' as const,
    difficulty: 'medium' as const,
    timeEstimate: 5,
  },
  {
    id: 'q2',
    question: 'Design a rate limiting system for a high-traffic API.',
    category: 'system-design' as const,
    difficulty: 'hard' as const,
    timeEstimate: 20,
  },
  {
    id: 'q3',
    question: 'What is the difference between process and thread?',
    category: 'technical' as const,
    difficulty: 'easy' as const,
    timeEstimate: 3,
  },
  {
    id: 'q4',
    question: 'How do you handle conflict with a peer who disagrees with your technical approach?',
    category: 'behavioral' as const,
    difficulty: 'medium' as const,
    timeEstimate: 5,
  },
]

const meta: Meta<typeof QuestionPanel> = {
  title: 'Organisms/QuestionPanel',
  component: QuestionPanel,
  args: {
    questions: QUESTIONS,
    onSelect: (id: string) => console.log('selected', id),
  },
}

export default meta
type Story = StoryObj<typeof QuestionPanel>

export const NoActive: Story = {}

export const WithActive: Story = {
  args: { activeId: 'q2' },
}
