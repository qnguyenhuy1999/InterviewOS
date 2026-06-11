import type { Meta, StoryObj } from '@storybook/react-vite'

import { VerifyEmailForm } from './VerifyEmailForm'

const meta = {
  title: 'Organisms/VerifyEmailForm',
  component: VerifyEmailForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onVerify: async () => {},
    onResend: async () => {},
  },
} satisfies Meta<typeof VerifyEmailForm>

export default meta
type Story = StoryObj<typeof meta>

export const ManualToken: Story = {}

export const WithToken: Story = {
  args: {
    token: 'verify-token-123',
  },
}
