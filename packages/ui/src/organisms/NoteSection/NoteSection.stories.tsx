import type { Meta, StoryObj } from '@storybook/react-vite'

import { BulletList } from '../../molecules/BulletList/BulletList'
import { NoteSection } from './NoteSection'

const meta = {
  title: 'Organisms/NoteSection',
  component: NoteSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    id: 'common-pitfalls',
    title: 'Common pitfalls',
    description: 'The mistakes that usually show up when understanding is still shallow.',
    children: (
      <BulletList
        items={[
          'Using unstable keys in reorderable lists.',
          'Confusing the render phase with visible DOM mutations.',
          'Assuming concurrent rendering means parallel DOM writes.',
        ]}
      />
    ),
  },
} satisfies Meta<typeof NoteSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Collapsible: Story = {
  args: {
    id: 'production-usage',
    title: 'Production usage',
    description: 'Examples that connect the concept to real product behavior.',
    collapsible: true,
    defaultOpen: false,
    tone: 'accent',
    children: (
      <BulletList
        items={[
          'Defer expensive filtering so input remains responsive.',
          'Separate urgent state from transition-driven updates.',
          'Use profiling before optimizing re-render paths.',
        ]}
      />
    ),
  },
}
