import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScoreCard } from './ScoreCard'
import type { ScoreSection } from './ScoreCard.types'

const SECTIONS: ScoreSection[] = [
  {
    id: 'technical',
    title: 'Technical Skills',
    criteria: [
      { id: 'problem-solving', label: 'Problem Solving', score: 4 },
      { id: 'system-design', label: 'System Design', score: 3 },
      { id: 'code-quality', label: 'Code Quality', score: null },
    ],
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    criteria: [
      { id: 'communication', label: 'Communication', score: 5 },
      { id: 'collaboration', label: 'Collaboration', score: 4 },
      { id: 'ownership', label: 'Ownership & Initiative', score: null },
    ],
  },
]

const meta: Meta<typeof ScoreCard> = {
  title: 'Organisms/ScoreCard',
  component: ScoreCard,
  args: {
    sections: SECTIONS,
    onChange: (sectionId, criteriaId, score) =>
      console.log('onChange', sectionId, criteriaId, score),
  },
}

export default meta
type Story = StoryObj<typeof ScoreCard>

export const Default: Story = {}

export const AllScored: Story = {
  args: {
    sections: SECTIONS.map((s) => ({
      ...s,
      criteria: s.criteria.map((c, i) => ({
        ...c,
        score: ([3, 4, 5, 4, 5, 3][i % 6] ?? 3) as 1 | 2 | 3 | 4 | 5,
      })),
    })),
  },
}

export const Empty: Story = {
  args: {
    sections: SECTIONS.map((s) => ({
      ...s,
      criteria: s.criteria.map((c) => ({ ...c, score: null })),
    })),
  },
}
