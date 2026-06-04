import type { ResumeAnalysis } from '@interviewos/types'

import { ResumeUploadForm } from '@/components/forms/ResumeUploadForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function ResumePage() {
  const latestAnalysis = await serverApiClient<ResumeAnalysis | null>('/resume/latest').catch(
    () => null,
  )

  return (
    <div className="mx-auto max-w-4xl">
      <ResumeUploadForm initialAnalysis={latestAnalysis} />
    </div>
  )
}
