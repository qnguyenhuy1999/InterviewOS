import { Button } from '../../../../components/ui/button'
import { SectionCard } from '../../../../components/ui/page'
import type { InterviewSessionPageProps, InterviewSessionPageSession, InterviewSessionPageTurn } from '../InterviewSessionPage.types'
import {
  formatInterviewSessionDateLabel,
  formatInterviewSessionSignedValue,
  getInterviewSessionCompletedTurns,
  getInterviewSessionHeaderDescription,
  getInterviewSessionReviewLabel,
} from '../InterviewSessionPage.utils'
import { ProgressRow } from './ProgressRow'

function MultiTurnBody({
  session,
  turns,
  reviewHref,
  renderMultiTurnForm,
}: {
  session: InterviewSessionPageSession
  turns: InterviewSessionPageTurn[]
  reviewHref?: string
  renderMultiTurnForm?: InterviewSessionPageProps['renderMultiTurnForm']
}) {
  const isComplete = session.status === 'COMPLETED'
  const completedTurns = getInterviewSessionCompletedTurns(session, turns)
  const maxTurns = session.maxTurns ?? 0

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <SectionCard
        title="Interview room"
        description={getInterviewSessionHeaderDescription(session)}
        className="xl:col-span-2"
      >
        <div className="space-y-4">
          {session.summary?.headline ? (
            <div className="rounded-md border border-border/80 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Session summary
              </p>
              <p className="mt-2 text-sm leading-6">{session.summary.headline}</p>
            </div>
          ) : null}

          <div className="rounded-md border border-border/80 bg-background p-4">
            {renderMultiTurnForm?.({ sessionId: session.id, turns, isComplete }) ?? (
              <p className="text-sm text-muted-foreground">
                Connect a multi-turn response form to continue this interview.
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      <div className="space-y-4">
        <SectionCard title="Progress" description="Current session status and activity.">
          <div className="space-y-3">
            <ProgressRow label="Version" value={`v${session.version ?? 1}`} />
            <ProgressRow label="Status" value={session.status} />
            <ProgressRow
              label="Turns"
              value={maxTurns > 0 ? `${completedTurns}/${maxTurns}` : `${completedTurns}`}
            />
            <ProgressRow
              label="Last activity"
              value={formatInterviewSessionDateLabel(session.lastActivityAt ?? session.updatedAt)}
            />
          </div>
        </SectionCard>

        {session.readinessImpact ? (
          <SectionCard
            title="Readiness impact"
            description="How this session is affecting your readiness signals."
          >
            <div className="space-y-3">
              <ProgressRow
                label="Overall"
                value={formatInterviewSessionSignedValue(session.readinessImpact.overallDelta)}
              />
              <ProgressRow
                label="Technical"
                value={formatInterviewSessionSignedValue(session.readinessImpact.technicalDelta)}
              />
              <ProgressRow
                label="Behavioral"
                value={formatInterviewSessionSignedValue(session.readinessImpact.behavioralDelta)}
              />
              <ProgressRow
                label="System design"
                value={formatInterviewSessionSignedValue(session.readinessImpact.systemDesignDelta)}
              />
              <ProgressRow
                label="Communication"
                value={formatInterviewSessionSignedValue(
                  session.readinessImpact.communicationDelta,
                )}
              />
            </div>
          </SectionCard>
        ) : null}

        {isComplete && reviewHref ? (
          <Button asChild className="w-full">
            <a href={reviewHref}>{getInterviewSessionReviewLabel()}</a>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export { MultiTurnBody }
