import type { DashboardProgress } from '@interviewos/types'
import DashboardPage from '@interviewos/ui/pages/DashboardPage'

import { APP_ROUTES } from '@/lib/app-routes'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

type ReadinessSnapshot = {
  overallScore: number
  confidenceLevel: number
  improvementTrend: number
  breakdown: Array<{
    dimension: string
    label: string
    score: number
    weight: number
    trend: 'UP' | 'DOWN' | 'STABLE'
  }>
}

export default async function Page() {
  const state = await loadRouteData(
    async () => {
      const [progress, readiness] = await Promise.all([
        serverApiClient<DashboardProgress>('/analytics/progress'),
        serverApiClient<ReadinessSnapshot>('/readiness'),
      ])

      return { progress, readiness }
    },
    {
      fallbackMessage: 'Unable to load dashboard progress.',
      isEmpty: ({ progress }) =>
        progress.interviewReadiness === 0 &&
        progress.technicalMastery === 0 &&
        progress.englishScore === 0 &&
        progress.reviewStreak === 0 &&
        progress.questionsPracticed === 0 &&
        progress.notesMastered === 0 &&
        progress.dueReviews === 0 &&
        progress.weakConceptTrends.length === 0,
    },
  )

  return (
    <DashboardPage
      state={
        state.kind === 'ready'
          ? { kind: 'ready', progress: state.data.progress, readiness: state.data.readiness }
          : state
      }
      actions={{
        createNoteHref: APP_ROUTES.notebookNew,
        startInterviewHref: APP_ROUTES.interviewStart,
        quickStartHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        allNotesHref: APP_ROUTES.notebook,
        allSessionsHref: APP_ROUTES.interview,
        englishNotesHref: APP_ROUTES.englishNotes,
        reviewQueueHref: APP_ROUTES.review,
        readinessHref: APP_ROUTES.readiness,
        retryHref: APP_ROUTES.dashboard,
      }}
    />
  )
}
