import type { Meta, StoryObj } from '@storybook/react-vite'

import { DefinitionList } from './DefinitionList'

const meta = {
  title: 'Molecules/DefinitionList',
  component: DefinitionList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Goal', value: 'Practice system design' },
      { label: 'Duration', value: '45 min' },
      { label: 'Focus', value: 'API contracts and tradeoffs' },
    ],
  },
} satisfies Meta<typeof DefinitionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = {
  args: {
    items: [
      { label: 'Score', value: '84' },
      { label: 'Rank', value: 'Top 15%' },
      { label: 'Attempts', value: '12' },
    ],
  },
}

export const DetailedValues: Story = {
  args: {
    items: [
      { label: 'Strength', value: 'Clear problem framing and fast iteration' },
      { label: 'Gap', value: 'Needs stronger follow-up questions' },
      { label: 'Next step', value: 'Review hooks, data fetching, and state ownership' },
    ],
  },
}

export const WideLabels: Story = {
  args: {
    items: [
      { label: 'Interview format preference', value: 'Pair programming' },
      { label: 'Target role', value: 'Senior frontend engineer' },
      { label: 'Primary market', value: 'Remote-first product teams' },
    ],
  },
}
