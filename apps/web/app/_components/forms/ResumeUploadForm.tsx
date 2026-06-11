'use client'

import { API_ROUTES } from '@interviewos/config'
import type { ResumeUploadAreaView } from '@interviewos/types'
import { ResumeUploadForm as ResumeUploadFormUI } from '@interviewos/ui/organisms/ResumeUploadForm'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function ResumeUploadForm({
  upload,
  hasExistingAnalysis,
  renderAs = 'panel',
}: {
  upload: ResumeUploadAreaView
  hasExistingAnalysis: boolean
  renderAs?: 'panel' | 'button'
}) {
  const router = useRouter()

  async function handleFileSelected(file: File) {
    const formData = new FormData()
    formData.set('file', file)
    const response = await apiFetch(API_ROUTES.resume.upload, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return (
    <ResumeUploadFormUI
      upload={upload}
      hasExistingAnalysis={hasExistingAnalysis}
      renderAs={renderAs}
      onFileSelected={handleFileSelected}
    />
  )
}
