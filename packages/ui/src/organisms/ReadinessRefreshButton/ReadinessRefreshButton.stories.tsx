import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReadinessRefreshButton } from './ReadinessRefreshButton'

const meta = {
  title: 'Organisms/ReadinessRefreshButton',
  component: ReadinessRefreshButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onRefresh: async () => {},
  },
} satisfies Meta<typeof ReadinessRefreshButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
