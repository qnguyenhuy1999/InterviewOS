import type { Meta, StoryObj } from '@storybook/react-vite'

import { BulletList } from './BulletList'

const meta = {
  title: 'Molecules/BulletList',
  component: BulletList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    items: [
      'Focus on one interview skill area at a time.',
      'Review the feedback before starting the next round.',
      'Keep practice sessions short and repeatable.',
    ],
  },
} satisfies Meta<typeof BulletList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ShortChecklist: Story = {
  args: {
    items: ['Pick a topic', 'Answer aloud', 'Review notes'],
  },
}

export const LongItems: Story = {
  args: {
    items: [
      'Practice answering with a clear opening, a structured middle, and a concise conclusion.',
      'Use the same prompt again tomorrow to compare how much the answer improved.',
      'Capture one actionable takeaway after every mock interview.',
    ],
  },
}

export const DenseSpacing: Story = {
  args: {
    className: 'space-y-1',
    items: ['One', 'Two', 'Three'],
  },
}
