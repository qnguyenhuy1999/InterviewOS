import type { Meta, StoryObj } from '@storybook/react-vite'

import { FileUploadDropzone } from './FileUploadDropzone'

const meta = {
  title: 'FileUploadDropzone',
  component: FileUploadDropzone,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Drop your resume here',
    description: 'Upload a PDF or DOCX to generate interview feedback and suggestions.',
    actionLabel: 'Browse files',
  },
} satisfies Meta<typeof FileUploadDropzone>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSupportingText: Story = {
  args: {
    supportingText: 'Supported: PDF, DOCX, TXT',
  },
}

export const PrimaryAction: Story = {
  args: {
    actionVariant: 'default',
    actionLabel: 'Upload resume',
  },
}

export const CompactDropzone: Story = {
  args: {
    contentClassName:
      'relative flex min-h-[14rem] flex-col items-center justify-center gap-4 px-5 py-6 text-center',
    actionSize: 'sm',
    title: 'Import notes',
    description: 'Bring in existing study notes to continue from where you left off.',
    actionLabel: 'Select file',
  },
}
