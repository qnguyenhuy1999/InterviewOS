import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import ReviewPage from './ReviewPage'
import { reviewPageFixture } from './ReviewPage.fixtures'

const meta = {
  title: 'Pages/ReviewPage',
  component: ReviewPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    startStudyHref: '#',
    retryHref: '#',
    state: { kind: 'ready', data: reviewPageFixture },
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Review">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof ReviewPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { state: { kind: 'loading' } },
}

export const EmptyState: Story = {
  args: { state: { kind: 'empty' } },
}

export const Error: Story = {
  args: {
    state: {
      kind: 'error',
      message: 'Unable to connect to the review service. Please try again in a moment.',
    },
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
