import { EmptyState } from '../../../../components/ui/page'
import {
  INTERVIEW_REVIEW_PAGE_EMPTY_DESCRIPTION,
  INTERVIEW_REVIEW_PAGE_EMPTY_TITLE,
} from '../InterviewReviewPage.constants'

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title={INTERVIEW_REVIEW_PAGE_EMPTY_TITLE}
      description={INTERVIEW_REVIEW_PAGE_EMPTY_DESCRIPTION}
    />
  )
}

export { EmptyBody }
