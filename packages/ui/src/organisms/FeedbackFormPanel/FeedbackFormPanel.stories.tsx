import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FeedbackFormPanel, type FeedbackSection } from './FeedbackFormPanel'

const meta = {
  title: 'Organisms/FeedbackFormPanel',
  component: FeedbackFormPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, height: 600 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackFormPanel>

export default meta
type Story = StoryObj<typeof meta>

const INITIAL_SECTIONS: FeedbackSection[] = [
  {
    id: 'technical',
    title: 'Technical Skills',
    fields: [
      {
        id: 'problem-solving',
        label: 'Problem Solving',
        type: 'rating',
        required: true,
        value: undefined,
      },
      {
        id: 'code-quality',
        label: 'Code Quality',
        type: 'rating',
        required: true,
        value: undefined,
      },
      { id: 'tech-notes', label: 'Technical notes', type: 'textarea', required: false, value: '' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    fields: [
      {
        id: 'clarity',
        label: 'Clarity of explanation',
        type: 'rating',
        required: true,
        value: undefined,
      },
      {
        id: 'comm-notes',
        label: 'Communication notes',
        type: 'textarea',
        required: false,
        value: '',
      },
    ],
  },
  {
    id: 'overall',
    title: 'Overall',
    fields: [
      { id: 'hire-rec', label: 'Hire recommendation', type: 'text', required: true, value: '' },
      { id: 'summary', label: 'Summary', type: 'textarea', required: true, value: '' },
    ],
  },
]

export const Default: Story = {
  render: () => {
    const [sections, setSections] = React.useState(INITIAL_SECTIONS)
    function handleChange(sectionId: string, fieldId: string, value: string | number) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, fields: s.fields.map((f) => (f.id === fieldId ? { ...f, value } : f)) }
            : s,
        ),
      )
    }
    return (
      <FeedbackFormPanel
        sections={sections}
        onChange={handleChange}
        onSubmit={() => alert('Submitted!')}
        isDraft
      />
    )
  },
}

export const SingleSection: Story = {
  render: () => {
    const initial = [INITIAL_SECTIONS[0]]
    const [sections, setSections] = React.useState(initial)
    function handleChange(sectionId: string, fieldId: string, value: string | number) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, fields: s.fields.map((f) => (f.id === fieldId ? { ...f, value } : f)) }
            : s,
        ),
      )
    }
    return (
      <FeedbackFormPanel
        sections={sections}
        onChange={handleChange}
        onSubmit={() => alert('Submitted!')}
      />
    )
  },
}
