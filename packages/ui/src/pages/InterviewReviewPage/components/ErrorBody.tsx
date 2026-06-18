import { EmptyState } from '../../../../components/ui/page'
import { INTERVIEW_REVIEW_PAGE_ERROR_TITLE } from '../InterviewReviewPage.constants'

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">{INTERVIEW_REVIEW_PAGE_ERROR_TITLE}</span>}
      description={message}
    />
  )
}

export { ErrorBody }
