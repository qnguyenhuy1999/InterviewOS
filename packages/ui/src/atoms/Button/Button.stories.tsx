import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { fn } from 'storybook/test'

import { Button } from '../../../components/ui/button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onClick: fn(), children: 'Button' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = { args: { variant: 'outline' } }

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }

export const Link: Story = { args: { variant: 'link' } }

export const Large: Story = { args: { size: 'lg' } }

export const Small: Story = { args: { size: 'sm' } }

export const ExtraSmall: Story = { args: { size: 'xs' } }

export const Disabled: Story = { args: { disabled: true } }

export const DisabledDestructive: Story = {
  args: { variant: 'destructive', children: 'Delete', disabled: true },
}

export const WithLeadingIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon /> New Note
      </>
    ) as React.ReactNode,
  },
}

export const WithTrailingIcon: Story = {
  args: {
    children: (
      <>
        Delete <TrashIcon />
      </>
    ) as React.ReactNode,
  },
}

export const IconOnly: Story = {
  args: { size: 'icon', children: (<PlusIcon />) as React.ReactNode, 'aria-label': 'Add item' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const).map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}
