import { NoteStatus, NoteType } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import NotebookPage from './NotebookPage'
import { notebookFixture } from './NotebookPage.fixtures'

const meta = {
  title: 'Pages/NotebookPage',
  component: NotebookPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
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
    empty: true,
  },
}

export const EmptyFilters: Story = {
  args: {
    notes: notebookFixture.notes,
    searchValue: 'kafka',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const Error: Story = {
  args: {
    error: 'Unable to connect to the notebook service. Please refresh and try again.',
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
