import type { Meta, StoryObj } from '@storybook/react-vite'

import { FieldLabel } from './FieldLabel'

const meta = {
  title: 'FieldLabel',
  component: FieldLabel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    label: 'Interview focus',
    description: 'Choose the main area you want to practice in this session.',
  },
} satisfies Meta<typeof FieldLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
}

export const LongLabel: Story = {
  args: {
    label: 'System design, API design, and tradeoff discussion for senior-level interviews',
  },
}

export const CompactLabel: Story = {
  args: {
    label: 'Difficulty',
    description: 'Keep the label short for dense settings panels.',
  },
}

export const RichLabelContent: Story = {
  args: {
    label: (
      <span>
        Interview focus <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Required</span>
      </span>
    ),
    description: 'Rich label content works when you need a helper badge or inline hint.',
  },
}
