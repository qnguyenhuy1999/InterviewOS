import { API_ROUTES } from '@interviewos/config'
import type { InterviewEvaluation, InterviewSessionDetail } from '@interviewos/types'
import InterviewReviewPage from '@interviewos/ui/pages/InterviewReviewPage'

import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
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
  await requireLearningProfile({
    reason: 'Complete onboarding before reviewing interview feedback.',
    next: APP_ROUTES.interviewReview(id),
  })

  const state = await loadRouteData(
    async () => {
      const [session, turns, evaluation] = await Promise.all([
        serverApiClient<InterviewSessionDetail>(API_ROUTES.sessions.byId(id)),
        serverApiClient<Turn[]>(API_ROUTES.sessions.turns(id)),
        serverApiClient<InterviewEvaluation>(API_ROUTES.sessions.evaluation(id)),
      ])

      return { session, turns, evaluation }
    },
    { fallbackMessage: 'Unable to load the interview review.' },
  )

  if (state.kind !== 'ready') {
    return <InterviewReviewPage error={state.kind === 'error' ? state.message : undefined} />
  }

  return (
    <InterviewReviewPage
      session={state.data.session}
      turns={state.data.turns}
      evaluation={state.data.evaluation}
      sessionHref={APP_ROUTES.interviewSession(id)}
      allSessionsHref={APP_ROUTES.interview}
    />
  )
}
