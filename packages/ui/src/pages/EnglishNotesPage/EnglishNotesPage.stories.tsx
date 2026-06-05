import type { Meta, StoryObj } from '@storybook/react-vite'

import EnglishNotesPage from './EnglishNotesPage'

const meta = {
  title: 'Pages/EnglishNotesPage',
  component: EnglishNotesPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof EnglishNotesPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const EmptyState: Story = {
  args: { empty: true },
}

export const Error: Story = {
  args: {
    error: 'Unable to load English note analytics right now.',
  },
}
