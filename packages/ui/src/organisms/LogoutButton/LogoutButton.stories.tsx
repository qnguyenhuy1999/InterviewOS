import type { Meta, StoryObj } from '@storybook/react-vite'

import { LogoutButton } from './LogoutButton'

const meta = {
  title: 'Organisms/LogoutButton',
  component: LogoutButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onLogout: async () => {},
  },
} satisfies Meta<typeof LogoutButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
