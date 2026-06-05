import type { Meta, StoryObj } from '@storybook/react-vite'

import NoteCard from './NoteCard'
import { manyNotes, noteFixtures } from './NoteCard.fixtures'

const meta = {
  title: 'Molecules/NoteCard',
  component: NoteCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof NoteCard>

export default meta
type Story = StoryObj<typeof meta>

export const Published: Story = {
  args: { note: noteFixtures.published },
}

export const Draft: Story = {
  args: { note: noteFixtures.draft },
}

export const Archived: Story = {
  args: { note: noteFixtures.archived },
}

export const WithActions: Story = {
  args: {
    note: noteFixtures.published,
    onEdit: () => {},
    onDelete: () => {},
  },
}

export const Loading: Story = {
  args: { note: noteFixtures.published, loading: true },
}

export const LongContent: Story = {
  args: {
    note: {
      ...noteFixtures.published,
      title:
        'Understanding JavaScript Event Loop, Microtask Queue, and Macrotask Queue in Modern Browsers',
      content:
        'The JavaScript event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. The event loop works by continuously checking the call stack and the task queues. When the call stack is empty, it processes the next task from the queue. This ensures asynchronous operations like setTimeout, fetch, and Promises behave predictably and in the correct order relative to synchronous code.',
      tags: ['javascript', 'event-loop', 'async', 'browser', 'performance', 'concurrency'],
    },
  },
}

export const Grid: Story = {
  args: { note: noteFixtures.published },
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <NoteCard note={noteFixtures.published} />
      <NoteCard note={noteFixtures.draft} />
      <NoteCard note={noteFixtures.archived} />
      <NoteCard note={noteFixtures.published} loading />
    </div>
  ),
}

export const ManyNotes: Story = {
  args: { note: noteFixtures.published },
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      {manyNotes.slice(0, 9).map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  ),
}

export const Mobile: Story = {
  args: { note: noteFixtures.published },
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <NoteCard note={noteFixtures.published} onEdit={() => {}} onDelete={() => {}} />
      <NoteCard note={noteFixtures.draft} />
    </div>
  ),
}
