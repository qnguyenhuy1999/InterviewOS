import type { Meta, StoryObj } from '@storybook/react-vite'

import { FormFieldMolecule } from './FormField.molecule'

const meta = {
  title: 'Molecules/FormFieldMolecule',
  component: FormFieldMolecule,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormFieldMolecule>

export default meta
type Story = StoryObj<typeof meta>

const inputStyle: React.CSSProperties = {
  background: 'var(--color-surface-inset)',
  border: '1px solid var(--color-border-interview)',
  borderRadius: 6,
  color: 'var(--color-text-primary)',
  padding: '8px 10px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export const Default: Story = {
  args: {
    label: 'Full name',
    children: <input type="text" placeholder="Jane Smith" style={inputStyle} />,
  },
}

export const Required: Story = {
  args: {
    label: 'Email address',
    required: true,
    children: <input type="email" placeholder="jane@example.com" style={inputStyle} />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Username',
    required: true,
    error: 'This field is required',
    children: (
      <input type="text" style={{ ...inputStyle, borderColor: 'var(--color-status-error)' }} />
    ),
  },
}

export const WithHint: Story = {
  args: {
    label: 'Bio',
    hint: 'Max 100 characters',
    children: <input type="text" placeholder="Tell us about yourself" style={inputStyle} />,
  },
}
