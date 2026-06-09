import type { InterviewEvaluation } from '@interviewos/types'

import { Button } from '../../../components/ui/button'
import { EmptyState, PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  INTERVIEW_REVIEW_PAGE_EMPTY_DESCRIPTION,
  INTERVIEW_REVIEW_PAGE_EMPTY_TITLE,
  INTERVIEW_REVIEW_PAGE_ERROR_TITLE,
  INTERVIEW_REVIEW_PAGE_TITLE,
} from './InterviewReviewPage.constants'
import { interviewReviewPageFixture } from './InterviewReviewPage.fixtures'
import type {
  InterviewReviewPageProps,
  InterviewReviewPageSession,
  InterviewReviewPageTurn,
} from './InterviewReviewPage.types'
import {
  formatInterviewReviewSignedValue,
  getInterviewReviewHeaderDescription,
  getInterviewReviewPendingMessage,
  getInterviewReviewState,
} from './InterviewReviewPage.utils'

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  )
}

function EvaluationPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  return (
    <div className="space-y-4 rounded-md border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-medium">Evaluation</h3>
          {evaluation.summary ? (
            <p className="mt-1 text-sm text-muted-foreground">{evaluation.summary}</p>
          ) : null}
        </div>
        {evaluation.overallScore != null ? (
          <div className="text-right">
            <p className="font-heading text-3xl font-medium">{evaluation.overallScore}</p>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        ) : null}
      </div>

      {evaluation.rubricScores.length > 0 ? (
        <div className="space-y-3">
          {evaluation.rubricScores.map((item) => (
            <ScoreBar key={item.key} label={item.label} score={item.score} />
          ))}
        </div>
      ) : null}

      {evaluation.evidence.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Evidence</p>
          <div className="space-y-3">
            {evaluation.evidence.map((item, index) => (
              <div
                key={`${item.quote}-${index}`}
                className="rounded-xl border border-border bg-background/60 p-3"
              >
                <p className="text-sm font-medium">{item.quote}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {evaluation.weaknesses.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Weaknesses</p>
          <div className="space-y-3">
            {evaluation.weaknesses.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-xl border border-border bg-background/60 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  <span className="text-xs text-muted-foreground">{item.severity}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {evaluation.recommendations.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Recommendations</p>
          <div className="space-y-3">
            {evaluation.recommendations.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-xl border border-border bg-background/60 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  <span className="text-xs text-muted-foreground">{item.priority}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

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

function ConversationReplay({ turns }: { turns: InterviewReviewPageTurn[] }) {
  return (
    <SectionCard title="Conversation replay" description="The recorded interviewer and candidate turns.">
      {turns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No turns recorded.</p>
      ) : (
        <div className="space-y-3">
          {turns.map((turn) => (
            <div
              key={turn.id}
              className={`flex ${turn.role === 'CANDIDATE' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  turn.role === 'CANDIDATE'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card'
                }`}
              >
                <p className="whitespace-pre-wrap">{turn.content}</p>
                <div
                  className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${
                    turn.role === 'CANDIDATE'
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span>{turn.role === 'CANDIDATE' ? 'You' : 'Interviewer'}</span>
                  <span>Turn {turn.turnNumber}</span>
                  {turn.topicTags && turn.topicTags.length > 0 ? (
                    <span>{turn.topicTags.join(', ')}</span>
                  ) : null}
                  {turn.decision ? <span>{turn.decision}</span> : null}
                </div>
                {turn.reasoning ? (
                  <p className="mt-2 text-xs opacity-80">Reasoning: {turn.reasoning}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 rounded-md" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <Skeleton className="h-96 rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-md" />
          <Skeleton className="h-56 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-64 rounded-md" />
    </div>
  )
}

function Root(props: InterviewReviewPageProps) {
  const state = getInterviewReviewState(props)
  const headerSession = state.kind === 'ready' ? state.session : interviewReviewPageFixture.session

  return (
    <>
      <PageHeader
        title={INTERVIEW_REVIEW_PAGE_TITLE}
        description={getInterviewReviewHeaderDescription(headerSession)}
      />

      <PageBody className="space-y-6">
        {state.kind === 'error' ? (
          <EmptyState
            className="min-h-[60vh] border-destructive/20 bg-destructive/5"
            title={<span className="text-destructive">{INTERVIEW_REVIEW_PAGE_ERROR_TITLE}</span>}
            description={state.message}
          />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyState
            className="min-h-80"
            title={INTERVIEW_REVIEW_PAGE_EMPTY_TITLE}
            description={INTERVIEW_REVIEW_PAGE_EMPTY_DESCRIPTION}
          />
        ) : (
          <>
            {state.evaluation ? (
              <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_320px]">
                <EvaluationPanel evaluation={state.evaluation} />
                <EvaluationSidebar evaluation={state.evaluation} session={state.session} />
              </section>
            ) : (
              <section className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                {getInterviewReviewPendingMessage(state.session.status)}
              </section>
            )}

            <ConversationReplay turns={state.turns} />

            {(props.sessionHref || props.allSessionsHref) ? (
              <div className="flex items-center gap-4 text-sm">
                {props.sessionHref ? (
                  <Button asChild variant="link" className="h-auto px-0">
                    <a href={props.sessionHref}>Back to session</a>
                  </Button>
                ) : null}
                {props.allSessionsHref ? (
                  <Button asChild variant="link" className="h-auto px-0 text-muted-foreground">
                    <a href={props.allSessionsHref}>All sessions</a>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </PageBody>
    </>
  )
}

const InterviewReviewPage = Object.assign(Root, {
  MetricRow,
})

export default InterviewReviewPage
