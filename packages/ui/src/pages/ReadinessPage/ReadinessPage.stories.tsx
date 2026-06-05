import type { Meta, StoryObj } from '@storybook/react-vite'

import ReadinessPage from './ReadinessPage'

const meta = {
  title: 'Pages/ReadinessPage',
  component: ReadinessPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ReadinessPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const EmptyState: Story = {
  args: { empty: true },
}

export const Error: Story = {
  args: {
    error: 'Unable to compute the latest readiness snapshot right now.',
  },
}
