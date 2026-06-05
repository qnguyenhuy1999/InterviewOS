import type { Meta, StoryObj } from '@storybook/react-vite'

import InterviewPage from './InterviewPage'
import { interviewPageFixture } from './InterviewPage.fixtures'

const meta = {
  title: 'Pages/InterviewPage',
  component: InterviewPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof InterviewPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {
  args: {
    sessions: interviewPageFixture.sessions,
    selectedTopic: interviewPageFixture.selectedTopic,
  },
}

export const FilteredByTopic: Story = {
  args: {
    sessions: interviewPageFixture.sessions,
    selectedTopic: 'React internals',
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const EmptyState: Story = {
  args: { empty: true },
}

export const Error: Story = {
  args: {
    error: 'Unable to load your interview history right now. Please try again.',
  },
}

export const Mobile: Story = {
  args: {
    sessions: interviewPageFixture.sessions,
    selectedTopic: interviewPageFixture.selectedTopic,
  },
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

export const Tablet: Story = {
  args: {
    sessions: interviewPageFixture.sessions,
    selectedTopic: interviewPageFixture.selectedTopic,
  },
  parameters: { viewport: { defaultViewport: 'tablet' } },
}

export const Desktop: Story = {
  args: {
    sessions: interviewPageFixture.sessions,
    selectedTopic: interviewPageFixture.selectedTopic,
  },
  parameters: { viewport: { defaultViewport: 'desktop' } },
}
