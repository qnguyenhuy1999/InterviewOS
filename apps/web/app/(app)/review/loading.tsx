import ReviewPage from '@interviewos/ui/pages/ReviewPage'

import { APP_ROUTES } from '@/lib/app-routes'

export default function ReviewLoading() {
  return <ReviewPage state={{ kind: 'loading' }} startStudyHref={APP_ROUTES.interviewStart} />
}
