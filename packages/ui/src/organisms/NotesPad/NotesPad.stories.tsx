import type { Meta, StoryObj } from '@storybook/react-vite'

import { NotesPad } from './NotesPad'

const meta: Meta<typeof NotesPad> = {
  title: 'Organisms/NotesPad',
  component: NotesPad,
  args: {
    sessionId: 'session-001',
    onChange: (text: string) => console.log('onChange', text),
  },
}

export default meta
type Story = StoryObj<typeof NotesPad>

export const Empty: Story = {}

export const WithContent: Story = {
  args: {
    initialContent:
      '/strength Strong system design fundamentals\n/concern Struggled with concurrency edge cases\n/followup Ask about production incident experience',
  },
}
