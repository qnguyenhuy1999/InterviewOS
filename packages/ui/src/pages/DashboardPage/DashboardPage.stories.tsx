import type { Meta, StoryObj } from '@storybook/react-vite'

import DashboardPage from './DashboardPage'

const meta = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardPage>

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
    error: 'Unable to connect to the server. Please check your connection and try again.',
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
