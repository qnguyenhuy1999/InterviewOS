import { NoteStatus, NoteType } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import ConsoleLayout from '../../layouts/ConsoleLayout'
import NotebookPage from './NotebookPage'
import { notebookFixture } from './NotebookPage.fixtures'
import { getNotebookNavigation } from './NotebookPage.utils'

const meta = {
  title: 'Pages/NotebookPage',
  component: NotebookPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    state: { kind: 'ready', notes: notebookFixture.notes },
    actions: {
      createNoteHref: '#',
      noteHref: () => '#',
      retryHref: '#',
    },
  },
  decorators: [
    (Story) => (
      <ConsoleLayout
        title="Notebook"
        navigation={getNotebookNavigation()}
        headerActions={
          <Button className="hidden rounded-xl px-4 md:inline-flex">
            <PlusIcon />
            New note
          </Button>
        }
      >
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof NotebookPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const ListView: Story = {
  args: {
    view: 'list',
  },
}

export const SearchFiltered: Story = {
  args: {
    searchValue: 'react',
    selectedTopic: 'React',
    selectedStatus: NoteStatus.INTERVIEW_READY,
    selectedType: NoteType.CONCEPT,
  },
}

export const EmptyState: Story = {
  args: {
    state: { kind: 'empty' },
  },
}

export const EmptyFilters: Story = {
  args: {
    searchValue: 'kafka',
  },
}

export const Loading: Story = {
  args: {
    state: { kind: 'loading' },
  },
}

export const Error: Story = {
  args: {
    state: {
      kind: 'error',
      message: 'Unable to connect to the notebook service. Please refresh and try again.',
    },
  },
}

export const Mobile: Story = {
  args: {
    view: 'list',
  },
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
}
