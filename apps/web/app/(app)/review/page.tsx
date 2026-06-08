import { API_ROUTES } from '@interviewos/config'
import type { ReviewPageView, UserWeakConcept } from '@interviewos/types'
import ReviewPage from '@interviewos/ui/pages/ReviewPage'

import { LearningPathActions } from '@/components/forms/LearningPathActions'
import { ReviewRatingActions } from '@/components/forms/ReviewRatingActions'
import { WeakConceptStatusActions } from '@/components/forms/WeakConceptStatusActions'
import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  await requireLearningProfile({
    reason: 'Complete onboarding before opening your review queue.',
    next: APP_ROUTES.review,
  })
  const state = await loadRouteData(
    async () => {
      const [review, weakConcepts] = await Promise.all([
        serverApiClient<ReviewPageView>(API_ROUTES.review.queue),
        serverApiClient<UserWeakConcept[]>(API_ROUTES.review.weakConcepts),
      ])

      return {
        ...review,
        weakConcepts: review.weakConcepts.map((concept) => ({
          ...concept,
          lastSeenAt: weakConcepts.find((item) => item.id === concept.id)?.lastSeenAt ?? null,
        })),
      }
    },
    {
      fallbackMessage: 'Unable to load the review queue.',
      isEmpty: (data) =>
        data.queue.length === 0 && data.learningPath.length === 0 && data.weakConcepts.length === 0,
    },
  )

  return (
    <ReviewPage
      state={state.kind === 'ready' ? { kind: 'ready', data: state.data } : state}
      retryHref={APP_ROUTES.review}
      startStudyHref={APP_ROUTES.interviewStart}
      renderRatingActions={(item) => <ReviewRatingActions reviewItemId={item.reviewItemId} />}
      renderLearningPathActions={(item) => <LearningPathActions itemId={item.id} />}
      renderWeakConceptActions={(concept) => (
        <WeakConceptStatusActions weakConceptId={concept.id} />
      )}
    />
  )
}
