/**
 * NoteCard — composite card for displaying a TechnicalNote.
 * Composed from shadcn Card + Badge. Not modifying any shadcn source files.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { manyNotes, noteFixtures, NoteStatus, NoteType } from '../../fixtures'

// ---------------------------------------------------------------------------
// NoteStatus → badge variant mapping (uses design system tokens, not hardcoded colors)
// ---------------------------------------------------------------------------
const statusVariant: Record<NoteStatus, 'default' | 'secondary' | 'outline'> = {
  [NoteStatus.PUBLISHED]: 'default',
  [NoteStatus.DRAFT]: 'secondary',
  [NoteStatus.ARCHIVED]: 'outline',
}

interface Note {
  id: string
  userId: string
  title: string
  content: string
  noteType: NoteType
  status: NoteStatus
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface NoteCardProps {
  note: Note
  onEdit?: () => void
  onDelete?: () => void
  loading?: boolean
}

function NoteCard({ note, onEdit, onDelete, loading }: NoteCardProps) {
  if (loading) {
    return (
      <Card className="w-72">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mt-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-72">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{note.title}</CardTitle>
          <Badge variant={statusVariant[note.status as NoteStatus]}>{note.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <TagIcon className="size-3" />
          {note.noteType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      {(onEdit || onDelete) && (
        <CardFooter className="gap-2 border-t pt-3">
          {onEdit && (
            <Button size="xs" variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="xs" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

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
