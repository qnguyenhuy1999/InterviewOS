import type { Meta, StoryObj } from '@storybook/react-vite'

import ReviewPage from './ReviewPage'

const meta = {
  title: 'Pages/ReviewPage',
  component: ReviewPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewPage>

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
    error: 'Unable to connect to the review service. Please try again in a moment.',
  },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
}

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
}
