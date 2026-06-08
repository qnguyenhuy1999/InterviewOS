import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import InterviewPage from './InterviewPage'
import { interviewPageFixture } from './InterviewPage.fixtures'

const meta = {
  title: 'Pages/InterviewPage',
  component: InterviewPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    state: {
      kind: 'ready',
      sessions: interviewPageFixture.sessions,
    },
    actions: {
      startInterviewHref: '/start-interview',
      quickStartHref: '/quick-start',
      reviewHref: (sessionId: string) => `/review/${sessionId}`,
      retryHref: '/retry',
    },
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Interviews">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof InterviewPage>

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
      message: 'Unable to load your interview history right now. Please try again.',
    },
  },
}
