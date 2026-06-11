import type { Meta, StoryObj } from '@storybook/react-vite'

import { RouteErrorState } from './RouteErrorState'

const meta = {
  title: 'Organisms/RouteErrorState',
  component: RouteErrorState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Unable to load interview session',
    message: 'The latest session data could not be loaded. Try again.',
    reset: () => {},
  },
} satisfies Meta<typeof RouteErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBackLink: Story = {
  args: {
    backHref: '/dashboard',
    backLabel: 'Back to dashboard',
  },
}
