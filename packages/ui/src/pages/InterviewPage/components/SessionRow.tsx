import { Button } from '../../../../components/ui/button'
import { TableCell, TableRow } from '../../../../components/ui/table'
import { INTERVIEW_PAGE_TYPE_LABELS } from '../InterviewPage.constants'
import type { InterviewPageSession } from '../InterviewPage.types'
import {
  formatInterviewDateLabel,
  formatInterviewDurationLabel,
  formatInterviewScore,
  getInterviewSessionMetrics,
  getInterviewTopicLabel,
} from '../InterviewPage.utils'

function SessionRow({
  session,
  reviewHref,
}: {
  session: InterviewPageSession
  reviewHref: string
}) {
  const topicLabel = getInterviewTopicLabel(session)
  const typeLabel = INTERVIEW_PAGE_TYPE_LABELS[session.type]
  const dateLabel = formatInterviewDateLabel(session.startedAt)
  const metrics = getInterviewSessionMetrics(session)
  const durationLabel = formatInterviewDurationLabel(metrics.durationMinutes)

  return (
    <TableRow>
      <TableCell className="px-5 py-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground md:text-base">{topicLabel}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:hidden">
            <span>{dateLabel}</span>
            <span>{typeLabel}</span>
            <span>{durationLabel}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-sm text-muted-foreground md:table-cell">
        {dateLabel}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm font-semibold md:table-cell">
        {formatInterviewScore(metrics.overallScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm text-muted-foreground lg:table-cell">
        {formatInterviewScore(metrics.technicalScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-center text-sm text-muted-foreground lg:table-cell">
        {formatInterviewScore(metrics.englishScore)}
      </TableCell>
      <TableCell className="hidden px-5 py-5 text-sm text-muted-foreground md:table-cell">
        {durationLabel}
      </TableCell>
      <TableCell className="px-5 py-5 text-right">
        <Button
          asChild
          variant="link"
          size="sm"
          className="h-auto px-0 font-medium text-foreground"
        >
          <a href={reviewHref}>Review</a>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export { SessionRow }
