import LearningPathPage from '@interviewos/ui/pages/LearningPathPage'

import { APP_ROUTES } from '@/lib/app-routes'

export default function LearningPathLoading() {
  return (
    <LearningPathPage
      state={{ kind: 'loading' }}
      reviewQueueHref={APP_ROUTES.review}
      focusModeHref={APP_ROUTES.interviewStart}
      retryHref={APP_ROUTES.learningPath}
    />
  )
}
