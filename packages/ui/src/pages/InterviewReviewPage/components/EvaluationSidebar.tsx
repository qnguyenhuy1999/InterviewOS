import type { InterviewEvaluation } from '@interviewos/types'

import { SectionCard } from '../../../../components/ui/page'
import type { InterviewReviewPageSession } from '../InterviewReviewPage.types'
import { formatInterviewReviewSignedValue } from '../InterviewReviewPage.utils'
import { MetricRow } from './MetricRow'

function EvaluationSidebar({
  evaluation,
  session,
}: {
  evaluation: InterviewEvaluation
  session: InterviewReviewPageSession
}) {
  return (
    <aside className="space-y-4">
      <SectionCard title="Confidence" description="Model confidence for this evaluation.">
        <p className="font-heading text-3xl font-medium">{evaluation.confidence ?? '--'}</p>
      </SectionCard>

      {session.readinessImpact ? (
        <SectionCard title="Readiness impact" description="How this session affects readiness.">
          <div className="space-y-3">
            <MetricRow
              label="Overall"
              value={formatInterviewReviewSignedValue(session.readinessImpact.overallDelta)}
            />
            <MetricRow
              label="Technical"
              value={formatInterviewReviewSignedValue(session.readinessImpact.technicalDelta)}
            />
            <MetricRow
              label="Behavioral"
              value={formatInterviewReviewSignedValue(session.readinessImpact.behavioralDelta)}
            />
            <MetricRow
              label="System design"
              value={formatInterviewReviewSignedValue(session.readinessImpact.systemDesignDelta)}
            />
            <MetricRow
              label="Communication"
              value={formatInterviewReviewSignedValue(session.readinessImpact.communicationDelta)}
            />
          </div>
        </SectionCard>
      ) : null}

      {session.summary ? (
        <SectionCard title="Replay summary" description="Key takeaways from the conversation.">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {session.summary.keyTakeaways.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </aside>
  )
}

export { EvaluationSidebar }
