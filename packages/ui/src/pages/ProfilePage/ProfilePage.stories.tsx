import type { Meta, StoryObj } from '@storybook/react-vite'

import ProfilePage from './ProfilePage'
import { profileFixture } from './ProfilePage.fixtures'

const meta = {
  title: 'Pages/ProfilePage',
  component: ProfilePage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfilePage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const NoResume: Story = {
  args: {
    profile: {
      ...profileFixture,
      resume: {
        ...profileFixture.resume,
        latest: null,
      },
    },
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
    error: 'Unable to load your profile right now. Please try again.',
  },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
}
