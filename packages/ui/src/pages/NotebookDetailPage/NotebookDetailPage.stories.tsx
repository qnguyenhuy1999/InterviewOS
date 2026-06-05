import { NoteStatus } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import NotebookDetailPage from './NotebookDetailPage'
import { notebookDetailFixture } from './NotebookDetailPage.fixtures'

const meta = {
  title: 'Pages/NotebookDetailPage',
  component: NotebookDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof NotebookDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const DraftNote: Story = {
  args: {
    data: {
      ...notebookDetailFixture,
      note: {
        ...notebookDetailFixture.note,
        status: NoteStatus.DRAFT,
        structuredContent: null,
        preferredOutputStyle: null,
        overrideLevel: null,
        overrideEnglishLevel: null,
      },
      questionCount: 0,
      generatedQuestions: [],
    },
  },
}

export const EmptyState: Story = {
  args: {
    empty: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const Error: Story = {
  args: {
    error: 'Unable to load this note. Please refresh and try again.',
  },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
}
