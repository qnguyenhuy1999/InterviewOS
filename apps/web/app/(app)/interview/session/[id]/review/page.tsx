import type { InterviewEvaluation, InterviewSessionDetail } from '@interviewos/types'
import { InterviewReviewPage } from '@interviewos/ui'

import { serverApiClient } from '@/lib/server-api-client'

type Turn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
  topicTags?: string[]
  reasoning?: string | null
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [session, turns, evaluation] = await Promise.all([
    serverApiClient<InterviewSessionDetail>(`/sessions/${id}`).catch(() => null),
    serverApiClient<Turn[]>(`/sessions/${id}/turns`).catch(() => [] as Turn[]),
    serverApiClient<InterviewEvaluation>(`/sessions/${id}/evaluation`).catch(() => null),
  ])

  return (
    <>
      <InterviewReviewPage session={session} turns={turns} evaluation={evaluation} />
      <div className="mx-auto mt-4 flex max-w-5xl items-center gap-4 text-sm">
        <a href={`/interview/session/${id}`} className="text-primary hover:underline">
          Back to session
        </a>
        <a href="/interview" className="text-muted-foreground hover:underline">
          All sessions
        </a>
      </div>
    </>
  )
}
