import { API_ROUTES } from '@interviewos/config'
import type { ReadinessHistoryView, ReadinessPageView, ReadinessSnapshot } from '@interviewos/types'
import ReadinessPage from '@interviewos/ui/pages/ReadinessPage'

import { ReadinessRefreshButton } from '@/app/_components/forms/ReadinessRefreshButton'
import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

type ReadinessHistoryResponse = {
  items: ReadinessHistoryView[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default async function ReadinessRoute() {
  await requireLearningProfile({
    reason: 'Complete onboarding before opening readiness analytics.',
    next: APP_ROUTES.readiness,
  })

  const state = await loadRouteData(
    async () => {
      const [latest, history] = await Promise.all([
        serverApiClient<ReadinessSnapshot | null>(API_ROUTES.readiness.current),
        serverApiClient<ReadinessHistoryResponse>(`${API_ROUTES.readiness.history}?page=1&limit=6`),
      ])

      return { latest, history: history.items }
    },
    {
      fallbackMessage: 'Unable to load readiness analytics.',
      isEmpty: ({ latest }) => latest === null,
    },
  )

  return (
    <ReadinessPage
      data={
        state.kind === 'ready' && state.data.latest
          ? createReadinessView(state.data.latest, state.data.history)
          : undefined
      }
      empty={state.kind === 'empty'}
      error={state.kind === 'error' ? state.message : undefined}
      retryHref={APP_ROUTES.readiness}
      startPracticeHref={APP_ROUTES.interviewStart}
      renderRecomputeAction={<ReadinessRefreshButton />}
    />
  )
}

function createReadinessView(
  latest: ReadinessSnapshot,
  history: ReadinessHistoryView[],
): ReadinessPageView {
  return {
    title: 'Readiness',
    subtitle:
      'A compact view of your current score, confidence, trend, and the dimensions driving it.',
    recomputeLabel: 'Recompute readiness',
    latest,
    history,
  }
}
