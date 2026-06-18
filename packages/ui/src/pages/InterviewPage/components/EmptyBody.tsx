import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'
import type { InterviewPageActions } from '../InterviewPage.types'

function EmptyBody({ actions }: { actions: InterviewPageActions }) {
  return (
    <EmptyState
      className="min-h-80"
      title="No interview sessions yet"
      description="Start a focused practice round to generate session feedback and score history."
      action={
        <Button asChild>
          <a href={actions.startInterviewHref}>Start first interview</a>
        </Button>
      }
    />
  )
}

export { EmptyBody }
