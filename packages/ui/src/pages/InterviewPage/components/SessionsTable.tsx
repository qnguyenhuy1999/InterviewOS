import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import type { InterviewPageActions, InterviewPageSession } from '../InterviewPage.types'
import { SessionRow } from './SessionRow'

function SessionsTable({
  sessions,
  actions,
}: {
  sessions: InterviewPageSession[]
  actions: InterviewPageActions
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-12 px-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Topic
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-xs font-medium uppercase tracking-widest text-muted-foreground md:table-cell">
              Date
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground md:table-cell">
              Score
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground lg:table-cell">
              Tech
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground lg:table-cell">
              English
            </TableHead>
            <TableHead className="hidden h-12 px-5 text-xs font-medium uppercase tracking-widest text-muted-foreground md:table-cell">
              Duration
            </TableHead>
            <TableHead className="h-12 px-5 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              reviewHref={`${actions.reviewHref}/${session.id}/review`}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { SessionsTable }
