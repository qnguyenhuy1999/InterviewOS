import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'
import {
  INTERVIEW_SESSION_PAGE_DEFAULT_RETRY_LABEL,
  INTERVIEW_SESSION_PAGE_ERROR_TITLE,
} from '../InterviewSessionPage.constants'

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">{INTERVIEW_SESSION_PAGE_ERROR_TITLE}</span>}
      description={message}
      action={
        retryHref ? (
          <Button asChild variant="destructive">
            <a href={retryHref}>{INTERVIEW_SESSION_PAGE_DEFAULT_RETRY_LABEL}</a>
          </Button>
        ) : undefined
      }
    />
  )
}

export { ErrorBody }
