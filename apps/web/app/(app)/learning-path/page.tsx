import type { LearningPathItem } from '@interviewos/types'
import LearningPathPage from '@interviewos/ui/pages/LearningPathPage'

import { LearningPathActions } from '@/app/_components/forms/LearningPathActions'
import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  await requireLearningProfile({
    reason: 'Complete onboarding before opening your learning path.',
    next: APP_ROUTES.learningPath,
  })
  const state = await loadRouteData(() => serverApiClient<LearningPathItem[]>('/learning-path'), {
    fallbackMessage: 'Unable to load the learning path.',
    isEmpty: (items) => items.length === 0,
  })

  return (
    <LearningPathPage
      state={state.kind === 'ready' ? { kind: 'ready', items: state.data } : state}
      reviewQueueHref={APP_ROUTES.review}
      focusModeHref={APP_ROUTES.interviewStart}
      retryHref={APP_ROUTES.learningPath}
      renderItemActions={(item) => <LearningPathActions itemId={item.id} />}
    />
  )
}
