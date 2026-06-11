import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResetPasswordForm } from './ResetPasswordForm'

const meta = {
  title: 'Organisms/ResetPasswordForm',
  component: ResetPasswordForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onSubmit: async () => {},
  },
} satisfies Meta<typeof ResetPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const WithoutToken: Story = {}

export const WithToken: Story = {
  args: {
    token: 'reset-token-123',
  },
}
