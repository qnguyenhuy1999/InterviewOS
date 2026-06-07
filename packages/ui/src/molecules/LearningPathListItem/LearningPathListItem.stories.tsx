import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../../components/ui/button'
import { LearningPathListItem } from './LearningPathListItem'

const meta = {
  title: 'LearningPathListItem',
  component: LearningPathListItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'System design fundamentals',
    description: 'Build a strong baseline for architecture interviews with structured practice.',
    priorityValue: 'A1',
    footer: '12 lessons, 4 checkpoints, 2 mock interviews',
    action: <Button size="sm">Open path</Button>,
    badges: [
      { label: 'Core track', variant: 'secondary' },
      { label: 'Recommended', variant: 'outline' },
    ],
  },
} satisfies Meta<typeof LearningPathListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PriorityOnly: Story = {
  args: {
    description: undefined,
    footer: undefined,
    action: undefined,
    badges: [],
    priorityLabel: 'Priority score',
    priorityValue: '92',
  },
}

export const WithMoreBadges: Story = {
  args: {
    badges: [
      { label: 'Frontend', variant: 'secondary' },
      { label: 'Interview-ready', variant: 'default' },
      { label: 'Updated today', variant: 'outline' },
    ],
  },
}

export const Actionless: Story = {
  args: {
    action: undefined,
    footer: 'Use the list item as a compact summary card.',
  },
}
