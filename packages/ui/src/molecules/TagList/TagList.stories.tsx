import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../../components/ui/button'
import { TagList } from './TagList'

const meta = {
  title: 'Molecules/TagList',
  component: TagList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    items: ['React', 'TypeScript', 'Testing'],
  },
} satisfies Meta<typeof TagList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OutlineTags: Story = {
  args: {
    variant: 'outline',
    items: ['Backend', 'Product', 'Design'],
  },
}

export const WithTrailingAction: Story = {
  args: {
    trailing: <Button size="xs">+ Add tag</Button>,
    items: ['Architecture', 'Performance'],
  },
}

export const DenseStack: Story = {
  args: {
    badgeClassName: 'px-2.5 h-7 text-xs',
    items: ['Mock interview', 'Weekly review', 'Priority topic', 'Needs follow-up'],
  },
}
