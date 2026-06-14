import type { Meta, StoryObj } from '@storybook/react-vite'

import AuthPage from './AuthPage'
import { authPageFixture } from './AuthPage.fixtures'

const meta = {
  title: 'Pages/AuthPage',
  component: AuthPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: authPageFixture,
} satisfies Meta<typeof AuthPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Register: Story = {
  args: {
    eyebrow: 'Create account',
    title: 'Build your private prep loop from day one.',
    description:
      'Create an account to start collecting interview feedback, weak concepts, and readiness signals in one place.',
  },
}
