import type { Meta, StoryObj } from '@storybook/react-vite'

import { RegisterForm } from './RegisterForm'

const meta = {
  title: 'Organisms/RegisterForm',
  component: RegisterForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onSubmit: async () => {},
  },
} satisfies Meta<typeof RegisterForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
