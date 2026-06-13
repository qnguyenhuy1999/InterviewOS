import type { FeedbackPageProps } from './FeedbackPage.types'

export const feedbackPageFixture: FeedbackPageProps = {
  onSubmit: () => {},
  onChange: () => {},
  isDraft: true,
  sections: [
    {
      id: 'overall',
      title: 'Overall Impression',
      fields: [
        {
          id: 'overall-rating',
          label: 'Overall Rating',
          type: 'rating',
          required: true,
          value: undefined,
        },
        { id: 'overall-notes', label: 'Notes', type: 'textarea', value: '' },
      ],
    },
    {
      id: 'technical',
      title: 'Technical Assessment',
      fields: [
        {
          id: 'tech-rating',
          label: 'Technical Score',
          type: 'rating',
          required: true,
          value: undefined,
        },
        { id: 'tech-strengths', label: 'Strengths', type: 'textarea', value: '' },
        { id: 'tech-gaps', label: 'Gaps', type: 'textarea', value: '' },
      ],
    },
  ],
}
