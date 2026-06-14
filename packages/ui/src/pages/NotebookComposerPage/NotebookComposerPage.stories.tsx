import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout'
import NotebookComposerPage from './NotebookComposerPage'
import { notebookComposerPageFixture } from './NotebookComposerPage.fixtures'

const meta = {
  title: 'Pages/NotebookComposerPage',
  component: NotebookComposerPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: notebookComposerPageFixture,
  decorators: [
    (Story) => (
      <ConsoleLayout title="Notebook">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof NotebookComposerPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
