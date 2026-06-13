import type { ScorecardPageProps } from './ScorecardPage.types'

export const scorecardPageFixture: ScorecardPageProps = {
  onScoreChange: () => {},
  sections: [
    {
      id: 'technical',
      title: 'Technical',
      criteria: [
        { id: 'depth', label: 'Technical Depth', score: null },
        { id: 'accuracy', label: 'Answer Accuracy', score: null },
        { id: 'debug', label: 'Debugging Skills', score: null },
      ],
    },
    {
      id: 'communication',
      title: 'Communication',
      criteria: [
        { id: 'clarity', label: 'Clarity', score: null },
        { id: 'structure', label: 'Structure', score: null },
      ],
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      criteria: [
        { id: 'approach', label: 'Approach', score: null },
        { id: 'adaptability', label: 'Adaptability', score: null },
      ],
    },
  ],
}
