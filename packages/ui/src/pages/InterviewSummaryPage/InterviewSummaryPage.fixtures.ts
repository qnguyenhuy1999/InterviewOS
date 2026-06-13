import type { InterviewSummaryPageProps } from './InterviewSummaryPage.types'

export const interviewSummaryPageFixture: InterviewSummaryPageProps = {
  candidateName: 'Alex Kim',
  role: 'Frontend Engineer',
  notes:
    'Strong React fundamentals. Good communication. Struggled with system design scope — needs more practice with large-scale architecture. Would recommend for mid-level position.',
  sections: [
    {
      id: 'technical',
      title: 'Technical',
      criteria: [
        { id: 'depth', label: 'Technical Depth', score: 4, notes: 'Solid React knowledge' },
        { id: 'accuracy', label: 'Answer Accuracy', score: 4 },
        { id: 'debug', label: 'Debugging Skills', score: 3 },
      ],
    },
    {
      id: 'communication',
      title: 'Communication',
      criteria: [
        { id: 'clarity', label: 'Clarity', score: 4 },
        { id: 'structure', label: 'Structure', score: 4 },
      ],
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      criteria: [
        { id: 'approach', label: 'Approach', score: 3 },
        { id: 'adaptability', label: 'Adaptability', score: 4 },
      ],
    },
  ],
}
