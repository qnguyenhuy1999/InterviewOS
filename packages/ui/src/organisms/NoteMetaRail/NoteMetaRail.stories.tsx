import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../../components/ui/button'
import { NoteMetaRail } from './NoteMetaRail'

const meta = {
  title: 'Organisms/NoteMetaRail',
  component: NoteMetaRail,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    progress: 48,
    activeSection: 'mental-model',
    readingTime: '2 min read',
    questionCount: 8,
    topicLabel: 'React',
    tocItems: [
      { id: 'summary', label: 'Quick summary' },
      { id: 'core-concepts', label: 'Core concepts' },
      { id: 'mental-model', label: 'Mental model' },
      { id: 'common-pitfalls', label: 'Common pitfalls' },
      { id: 'interview-answer', label: 'Interview-ready answer' },
    ],
    mobileTocAction: (
      <Button variant="outline" size="sm" className="rounded-full">
        Open TOC
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoteMetaRail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NearComplete: Story = {
  args: {
    progress: 92,
    activeSection: 'interview-answer',
  },
}
