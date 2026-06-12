import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../../../components/ui/button'
import { NoteHeader, NoteHeaderBadge } from './NoteHeader'

const meta = {
  title: 'Organisms/NoteHeader',
  component: NoteHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    eyebrow: (
      <>
        <span>Notebook detail</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <span>Updated 7 days ago</span>
      </>
    ),
    title: 'React reconciliation & the fiber architecture',
    summary:
      'A learning-first breakdown of how React schedules rendering work, preserves identity, and keeps interfaces responsive.',
    meta: (
      <>
        <NoteHeaderBadge>React</NoteHeaderBadge>
        <NoteHeaderBadge>Concept</NoteHeaderBadge>
        <NoteHeaderBadge>Interview ready</NoteHeaderBadge>
        <NoteHeaderBadge>2 min read</NoteHeaderBadge>
      </>
    ),
    actions: (
      <Button size="sm" className="rounded-full px-4">
        Generate questions
      </Button>
    ),
  },
} satisfies Meta<typeof NoteHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Minimal: Story = {
  args: {
    meta: (
      <>
        <NoteHeaderBadge>System Design</NoteHeaderBadge>
        <NoteHeaderBadge>5 min read</NoteHeaderBadge>
      </>
    ),
    actions: undefined,
  },
}
