import InterviewPage from '@interviewos/ui/pages/InterviewPage'

import { APP_ROUTES } from '@/lib/app-routes'

export default function InterviewLoading() {
  return (
    <InterviewPage
      state={{ kind: 'loading' }}
      actions={{
        startInterviewHref: APP_ROUTES.interviewStart,
        quickStartHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        reviewHref: APP_ROUTES.interviewReview,
        retryHref: APP_ROUTES.interview,
      }}
    />
  )
}
