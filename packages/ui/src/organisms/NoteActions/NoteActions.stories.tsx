import type { Meta, StoryObj } from '@storybook/react-vite'

import { NoteActions } from './NoteActions'

const meta = {
  title: 'Organisms/NoteActions',
  component: NoteActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    canGenerateQuestions: true,
    editNoteHref: '/notebook/note-1/edit',
    onGenerateNote: async () => {},
    onGenerateQuestions: async () => {},
  },
} satisfies Meta<typeof NoteActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const QuestionsDisabled: Story = {
  args: {
    canGenerateQuestions: false,
  },
}
