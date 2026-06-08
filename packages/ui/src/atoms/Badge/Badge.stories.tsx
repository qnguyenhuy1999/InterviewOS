import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckCircleIcon, StarIcon, XCircleIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Badge' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Destructive: Story = { args: { variant: 'destructive', children: 'Error' } }

export const Outline: Story = { args: { variant: 'outline' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const WithLeadingIcon: Story = {
  args: {
    children: (
      <>
        <CheckCircleIcon /> Published
      </>
    ) as React.ReactNode,
    variant: 'default',
  },
}

export const WithTrailingIcon: Story = {
  args: {
    children: (
      <>
        Failed <XCircleIcon />
      </>
    ) as React.ReactNode,
    variant: 'destructive',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'secondary', 'destructive', 'outline', 'ghost'] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">
        <CheckCircleIcon /> Published
      </Badge>
      <Badge variant="secondary">
        <StarIcon /> Draft
      </Badge>
      <Badge variant="destructive">
        <XCircleIcon /> Archived
      </Badge>
      <Badge variant="outline">Concept</Badge>
    </div>
  ),
}
