import type { Meta, StoryObj } from '@storybook/react-vite'

import { Chip } from './Chip'

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'React' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithRemove: Story = {
  args: { label: 'TypeScript', onRemove: () => {} },
}

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
}

export const Filter: Story = {
  args: { label: 'Frontend', variant: 'filter' },
}

export const Skill: Story = {
  args: { label: 'Node.js', variant: 'skill' },
}

export const Topic: Story = {
  args: { label: 'System Design', variant: 'topic' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Chip label="Filter" variant="filter" onRemove={() => {}} />
      <Chip label="Skill" variant="skill" onRemove={() => {}} />
      <Chip label="Topic" variant="topic" onRemove={() => {}} />
      <Chip label="Disabled" disabled />
    </div>
  ),
}
