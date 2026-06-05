import type { Meta, StoryObj } from '@storybook/react-vite'

import LearningPathPage from './LearningPathPage'

const meta = {
  title: 'Pages/LearningPathPage',
  component: LearningPathPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof LearningPathPage>

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
    error: 'Unable to load the next recommended study tasks.',
  },
}
