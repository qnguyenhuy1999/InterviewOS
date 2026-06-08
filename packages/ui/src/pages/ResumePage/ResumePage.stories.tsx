import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import ResumePage from './ResumePage'
import { resumePageFixture } from './ResumePage.fixtures'

const meta = {
  title: 'Pages/ResumePage',
  component: ResumePage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    data: resumePageFixture,
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="Resume">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof ResumePage>

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
    error: 'Unable to load the latest resume analysis. Please try again in a moment.',
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
