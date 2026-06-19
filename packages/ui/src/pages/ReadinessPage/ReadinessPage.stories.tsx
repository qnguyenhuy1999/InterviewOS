import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import ReadinessPage from './ReadinessPage'
import { readinessPageFixture } from './ReadinessPage.fixtures'

const meta = {
  title: 'Pages/ReadinessPage',
  component: ReadinessPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    data: readinessPageFixture,
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Interview Readiness">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof ReadinessPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const EmptyState: Story = {
  args: { empty: true, startPracticeHref: '/interview/start' },
}

export const Error: Story = {
  args: {
    error: 'Unable to compute the latest readiness snapshot right now.',
    retryHref: '/readiness',
  },
}
