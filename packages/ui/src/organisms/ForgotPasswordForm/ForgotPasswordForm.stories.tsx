import type { Meta, StoryObj } from '@storybook/react-vite'

import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta = {
  title: 'Organisms/ForgotPasswordForm',
  component: ForgotPasswordForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onSubmit: async () => {},
  },
} satisfies Meta<typeof ForgotPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
