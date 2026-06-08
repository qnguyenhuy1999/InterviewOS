import type { Meta, StoryObj } from '@storybook/react-vite'

import ConsoleLayout from '../../layouts/ConsoleLayout/ConsoleLayout'
import EnglishNotesPage from './EnglishNotesPage'

const meta = {
  title: 'Pages/EnglishNotesPage',
  component: EnglishNotesPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    state: {
      kind: 'ready',
      notes: [
        {
          id: '1',
          originalSentence: 'She go to school every day.',
          correctedSentence: 'She goes to school every day.',
          naturalVersion: 'She goes to school every day.',
          explanation:
            'The verb "go" should be conjugated as "goes" in the third person singular form.',
          grammarTopic: 'Subject-Verb Agreement',
          recommendedStudyTopics: ['Subject-Verb Agreement', 'Present Simple Tense'],
          practicePatterns: ['She ___ to school every day.'],
          status: 'NEEDS_PRACTICE',
          createdAt: new Date(),
        },
        {
          id: '2',
          originalSentence: 'I has a cat.',
          correctedSentence: 'I have a cat.',
          naturalVersion: 'I have a cat.',
          explanation:
            'The verb "has" should be conjugated as "have" in the first person singular form.',
          grammarTopic: 'Subject-Verb Agreement',
          recommendedStudyTopics: ['Subject-Verb Agreement', 'Present Simple Tense'],
          practicePatterns: ['I ___ a cat.'],
          status: 'MASTERED',
          createdAt: new Date(),
        },
      ],
    },
    actions: {
      reviewLatestHref: '#',
      startPracticeHref: '#',
    },
  },
  decorators: [
    (Story) => (
      <ConsoleLayout title="English Notes">
        <Story />
      </ConsoleLayout>
    ),
  ],
} satisfies Meta<typeof EnglishNotesPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { state: { kind: 'loading' } },
}

export const EmptyState: Story = {
  args: { state: { kind: 'empty' } },
}

export const Error: Story = {
  args: {
    state: { kind: 'error', message: 'Failed to load English notes. Please try again.' },
  },
}
