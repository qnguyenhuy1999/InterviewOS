import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import SessionPage from './SessionPage'
import { sessionPageFixture } from './SessionPage.fixtures'

const meta = {
  title: 'Pages/SessionPage',
  component: SessionPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ConsoleLayout title="Sessions">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof SessionPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {
  args: { sessions: sessionPageFixture.sessions },
}

export const RevokingState: Story = {
  args: {
    sessions: sessionPageFixture.sessions,
    revokingSessionId: 'session-iphone',
  },
}

export const LogoutEverywherePending: Story = {
  args: {
    sessions: sessionPageFixture.sessions,
    isLoggingOutEverywhere: true,
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const EmptyState: Story = {
  args: { empty: true, sessions: [] },
}

export const Error: Story = {
  args: {
    error: 'Unable to load your current device sessions right now. Please try again.',
  },
}

export const Mobile: Story = {
  args: { sessions: sessionPageFixture.sessions },
  parameters: { viewport: { defaultViewport: 'mobile' } },
}
