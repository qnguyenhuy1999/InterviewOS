import { EmptyState } from '../../../../components/ui/page'
import {
  INTERVIEW_SESSION_PAGE_EMPTY_DESCRIPTION,
  INTERVIEW_SESSION_PAGE_EMPTY_TITLE,
} from '../InterviewSessionPage.constants'

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title={INTERVIEW_SESSION_PAGE_EMPTY_TITLE}
      description={INTERVIEW_SESSION_PAGE_EMPTY_DESCRIPTION}
    />
  )
}

export { EmptyBody }
