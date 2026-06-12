'use client'

import type { ResumeUploadAreaView } from '@interviewos/types'
import { useRef, useState } from 'react'

import { Button } from '../../../components/ui/button'
import { FormNotice } from '../../lib/form-ui'
import { FileUploadDropzone } from '../FileUploadDropzone/FileUploadDropzone'

interface ResumeUploadFormProps {
  upload: ResumeUploadAreaView
  hasExistingAnalysis: boolean
  renderAs?: 'panel' | 'button'
  onFileSelected: (file: File) => Promise<void>
}

export function ResumeUploadForm({
  upload,
  hasExistingAnalysis,
  renderAs = 'panel',
  onFileSelected,
}: ResumeUploadFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange() {
    const file = inputRef.current?.files?.[0]

    if (!file) {
      return
    }

    setPending(true)
    setError(null)

    try {
      await onFileSelected(file)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to analyze your resume.',
      )
    } finally {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setPending(false)
    }
  }

  const actionLabel = pending ? 'Uploading...' : upload.actionLabel

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="sr-only"
        onChange={() => {
          void handleFileChange()
        }}
      />
      {renderAs === 'panel' ? (
        <FileUploadDropzone
          title={pending ? 'Analyzing your resume...' : upload.title}
          description={upload.description}
          supportingText={
            pending
              ? 'This usually takes a few seconds.'
              : `${upload.supportedFormatsLabel}${hasExistingAnalysis ? ' Uploading again replaces the latest analysis.' : ''}`
          }
          actionLabel={actionLabel}
          actionVariant="default"
          actionSize="lg"
          onActionClick={() => inputRef.current?.click()}
        />
      ) : (
        <Button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {actionLabel}
        </Button>
      )}
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
    </div>
  )
}
