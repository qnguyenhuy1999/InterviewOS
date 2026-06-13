import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from './Label'

const meta = {
  title: 'Atoms/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Email address' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: { children: 'Password', variant: 'required' },
}

export const Optional: Story = {
  args: { children: 'Nickname', variant: 'optional' },
}

export const Hint: Story = {
  args: { children: 'We will never share your email with anyone else.', variant: 'hint' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Label>Default label</Label>
      <Label variant="required">Required field</Label>
      <Label variant="optional">Optional field</Label>
      <Label variant="hint">Helper text shown below a field</Label>
    </div>
  ),
}
