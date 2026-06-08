import { API_ROUTES } from '@interviewos/config'
import type { InterviewSessionListView } from '@interviewos/types'
import InterviewPage from '@interviewos/ui/pages/InterviewPage'

import { APP_ROUTES } from '@/lib/app-routes'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const state = await loadRouteData(
    () => serverApiClient<InterviewSessionListView[]>(API_ROUTES.sessions.list),
    {
      fallbackMessage: 'Unable to load interview sessions.',
      isEmpty: (sessions) => sessions.length === 0,
    },
  )

  return (
    <InterviewPage
      state={state.kind === 'ready' ? { kind: 'ready', sessions: state.data } : state}
      actions={{
        startInterviewHref: APP_ROUTES.interviewStart,
        quickStartHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        reviewHref: APP_ROUTES.interviewReview,
        retryHref: APP_ROUTES.interview,
      }}
    />
  )
}
