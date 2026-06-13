import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircle, AlertTriangle, CheckCircle, Info, Search, Star } from 'lucide-react'

import { Icon } from './Icon'

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { icon: Search },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon icon={Search} size="sm" aria-label="Small search" />
      <Icon icon={Search} size="md" aria-label="Medium search" />
      <Icon icon={Search} size="lg" aria-label="Large search" />
    </div>
  ),
}

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon icon={Star} intent="default" aria-label="Default" />
      <Icon icon={Star} intent="muted" aria-label="Muted" />
      <Icon icon={Star} intent="accent" aria-label="Accent" />
      <Icon icon={CheckCircle} intent="success" aria-label="Success" />
      <Icon icon={AlertTriangle} intent="warning" aria-label="Warning" />
      <Icon icon={AlertCircle} intent="error" aria-label="Error" />
      <Icon icon={Info} intent="default" aria-label="Info" />
    </div>
  ),
}
