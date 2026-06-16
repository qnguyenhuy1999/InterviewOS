import { API_ROUTES } from '@interviewos/config'
import type { InterviewSessionDetail, InterviewSessionListView } from '@interviewos/types'
import InterviewPage from '@interviewos/ui/pages/InterviewPage'

import { APP_ROUTES } from '@/lib/app-routes'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const state = await loadRouteData(
    async () => {
      const sessions = await serverApiClient<InterviewSessionDetail[]>(API_ROUTES.sessions.list)
      return sessions.map(mapSessionToListView)
    },
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
        reviewHref: '/interview/session',
        retryHref: APP_ROUTES.interview,
      }}
    />
  )
}

function mapSessionToListView(session: InterviewSessionDetail): InterviewSessionListView {
  const answers = session.questions
    .map((question) => question.answer)
    .filter((answer): answer is NonNullable<typeof answer> => answer != null)

  const latestAnswer = answers.at(-1) ?? null
  const durationMinutes =
    session.startedAt && session.endedAt
      ? Math.max(
          0,
          Math.round(
            (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000,
          ),
        )
      : 0

  return {
    id: session.id,
    type: session.type,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    note: session.note ?? null,
    metrics: {
      overallScore: latestAnswer?.overallScore ?? session.evaluation?.overallScore ?? null,
      technicalScore: latestAnswer?.technicalScore ?? null,
      englishScore: latestAnswer?.englishScore ?? null,
      durationMinutes,
    },
  }
}
