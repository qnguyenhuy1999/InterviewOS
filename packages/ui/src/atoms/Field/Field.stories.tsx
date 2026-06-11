import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from './Field'

const meta = {
  title: 'Atoms/Field',
  component: Field,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    label: 'Email',
    children: (
      <input
        type="email"
        placeholder="you@example.com"
        className="w-72 rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    ),
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: {
    error: 'A valid email address is required.',
  },
}
