import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { content: 'Tooltip content', delay: 0 },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const Trigger = () => (
  <button
    type="button"
    style={{
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid var(--color-border-interview)',
      background: 'var(--color-surface-raised)',
      color: 'var(--color-text-primary)',
      cursor: 'pointer',
      fontSize: 13,
    }}
  >
    Hover me
  </button>
)

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Trigger />
    </Tooltip>
  ),
}

export const Top: Story = {
  args: { placement: 'top', content: 'Appears above' },
  render: (args) => (
    <Tooltip {...args}>
      <Trigger />
    </Tooltip>
  ),
}

export const Bottom: Story = {
  args: { placement: 'bottom', content: 'Appears below' },
  render: (args) => (
    <Tooltip {...args}>
      <Trigger />
    </Tooltip>
  ),
}

export const Left: Story = {
  args: { placement: 'left', content: 'Appears left' },
  render: (args) => (
    <Tooltip {...args}>
      <Trigger />
    </Tooltip>
  ),
}

export const Right: Story = {
  args: { placement: 'right', content: 'Appears right' },
  render: (args) => (
    <Tooltip {...args}>
      <Trigger />
    </Tooltip>
  ),
}

export const WithShortcut: Story = {
  args: { content: 'Command palette', shortcut: '⌘K', placement: 'bottom' },
  render: (args) => (
    <Tooltip {...args}>
      <Trigger />
    </Tooltip>
  ),
}
