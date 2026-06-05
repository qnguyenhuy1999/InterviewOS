import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

const meta = {
  title: 'Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'number', 'url'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-64 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="jane@example.com" />
    </div>
  ),
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password...' },
}

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search notes...' },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled input', value: 'Cannot edit this' },
}

export const Invalid: Story = {
  render: () => (
    <div className="grid w-64 gap-1.5">
      <Label htmlFor="invalid-email">Email</Label>
      <Input id="invalid-email" type="email" aria-invalid="true" defaultValue="not-an-email" />
      <p className="text-sm text-destructive">Please enter a valid email address.</p>
    </div>
  ),
}

export const WithValue: Story = {
  args: { defaultValue: 'React Reconciliation Algorithm', type: 'text' },
}

export const LongContent: Story = {
  args: {
    defaultValue:
      'This is a very long note title that should overflow gracefully and be handled with proper text clipping behavior',
  },
}
