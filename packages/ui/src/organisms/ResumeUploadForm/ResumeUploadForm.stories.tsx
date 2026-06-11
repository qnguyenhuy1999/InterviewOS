import type { ResumeUploadAreaView } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResumeUploadForm } from './ResumeUploadForm'

const uploadFixture: ResumeUploadAreaView = {
  title: 'Upload your resume',
  description: 'Analyze your current resume and generate interview prep signals.',
  supportedFormatsLabel: 'Supported: PDF, DOCX, TXT',
  actionLabel: 'Choose file',
}

const meta = {
  title: 'Organisms/ResumeUploadForm',
  component: ResumeUploadForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    upload: uploadFixture,
    hasExistingAnalysis: false,
    onFileSelected: async () => {},
  },
} satisfies Meta<typeof ResumeUploadForm>

export default meta
type Story = StoryObj<typeof meta>

export const Panel: Story = {}

export const Button: Story = {
  args: {
    renderAs: 'button',
    hasExistingAnalysis: true,
  },
}
