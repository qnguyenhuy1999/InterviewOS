'use client'

import { API_ROUTES } from '@interviewos/config'
import type { ResumeUploadAreaView } from '@interviewos/types'
import { FileUploadDropzone } from '@interviewos/ui/organisms/FileUploadDropzone'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { apiFetch } from '@/lib/api-client'

type ResumeUploadFormProps = {
  upload: ResumeUploadAreaView
  hasExistingAnalysis: boolean
  renderAs?: 'panel' | 'button'
}

export function ResumeUploadForm({
  upload,
  hasExistingAnalysis,
  renderAs = 'panel',
}: ResumeUploadFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
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
      const formData = new FormData()
      formData.set('file', file)

      const response = await apiFetch(API_ROUTES.resume.upload, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
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
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {actionLabel}
        </button>
      )}
      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  )
}
