import type { LearningPathItem } from '@interviewos/types'

import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

import LearningPathPageClient from './LearningPathPageClient'

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
    <LearningPathPageClient
      state={state.kind === 'ready' ? { kind: 'ready', items: state.data } : state}
      reviewQueueHref={APP_ROUTES.review}
      focusModeHref={APP_ROUTES.interviewStart}
      retryHref={APP_ROUTES.learningPath}
    />
  )
}
