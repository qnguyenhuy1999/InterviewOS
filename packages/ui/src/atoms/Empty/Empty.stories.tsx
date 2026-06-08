import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon, PlusIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../../components/ui/empty'

const meta = {
  title: 'Atoms/Empty',
  component: Empty,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty className="border border-border min-h-48 w-80">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookOpenIcon />
        </EmptyMedia>
        <EmptyTitle>No notes yet</EmptyTitle>
        <EmptyDescription>
          Create your first study note to get started with your interview prep.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon /> New Note
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const NoInterviewSessions: Story = {
  render: () => (
    <Empty className="border border-border min-h-48 w-80">
      <EmptyHeader>
        <EmptyTitle>No interview sessions</EmptyTitle>
        <EmptyDescription>Start a practice session to track your progress.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Start Practice
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const NoSearchResults: Story = {
  render: () => (
    <Empty className="border border-border min-h-48 w-80">
      <EmptyHeader>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search query or clearing the filters.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <Empty className="border border-destructive/30 bg-destructive/5 min-h-48 w-80">
      <EmptyHeader>
        <EmptyTitle className="text-destructive">Failed to load</EmptyTitle>
        <EmptyDescription>
          Something went wrong while loading your data. Please try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="destructive">
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  ),
}
