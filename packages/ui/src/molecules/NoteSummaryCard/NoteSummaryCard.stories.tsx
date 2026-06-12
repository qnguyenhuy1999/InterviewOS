import type { Meta, StoryObj } from '@storybook/react-vite'

import { NoteSummaryCard } from './NoteSummaryCard'

const meta = {
  title: 'Molecules/NoteSummaryCard',
  component: NoteSummaryCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    summary:
      'Fiber is React’s scheduling-friendly execution model. It lets updates pause, resume, and prioritize work so large trees do not block the interface.',
    quickReference: [
      'Reconciliation compares previous and next trees.',
      'Fiber stores enough work metadata to pause and resume rendering.',
      'Stable keys preserve instance identity.',
    ],
  },
} satisfies Meta<typeof NoteSummaryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutQuickReference: Story = {
  args: {
    quickReference: [],
  },
}
