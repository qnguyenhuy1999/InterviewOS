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

function NarrativeFeedbackPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  const hasStrengths = evaluation.strengths.length > 0
  const hasImprovements = evaluation.improvements.length > 0
  const hasCoaching = evaluation.coachingNotes.length > 0

  if (!evaluation.summary && !hasStrengths && !hasImprovements && !hasCoaching) return null

  return (
    <div className="space-y-4 rounded-md border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-lg font-medium">Feedback summary</h3>
        {evaluation.overallScore != null ? (
          <div className="text-right shrink-0">
            <p className="font-heading text-3xl font-medium">{evaluation.overallScore}</p>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        ) : null}
      </div>

      {evaluation.summary ? (
        <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.summary}</p>
      ) : null}

      {hasStrengths ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">What you did well</p>
          <ul className="space-y-1">
            {evaluation.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasImprovements ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Areas to improve</p>
          <ul className="space-y-1">
            {evaluation.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasCoaching ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Coaching notes</p>
          <ul className="space-y-1">
            {evaluation.coachingNotes.map((note, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function NextBestActionPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  const topRecommendation = evaluation.recommendations[0]
  const topWeakConcept = evaluation.weakConcepts[0]

  if (!topRecommendation && !topWeakConcept) return null

  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 p-5 space-y-3">
      <h3 className="font-heading text-base font-medium">Next best action</h3>
      {topWeakConcept ? (
        <p className="text-sm text-muted-foreground">
          You struggled with <span className="font-medium text-foreground">{topWeakConcept}</span>. Focus your next study session on this concept.
        </p>
      ) : null}
      {topRecommendation ? (
        <div className="rounded-md border border-border bg-card p-3 space-y-1">
          <p className="text-sm font-medium">{topRecommendation.title}</p>
          <p className="text-xs text-muted-foreground">{topRecommendation.detail}</p>
        </div>
      ) : null}
    </div>
  )
}

function EvaluationPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  return (
    <div className="space-y-4 rounded-md border border-border bg-card p-5">
      <h3 className="font-heading text-lg font-medium">Detailed scores</h3>

      {evaluation.rubricScores.length > 0 ? (
        <div className="space-y-3">
          {evaluation.rubricScores.map((item) => (
            <ScoreBar key={item.key} label={item.label} score={item.score} />
          ))}
        </div>
      ) : null}

      {evaluation.evidence.length > 0 || evaluation.weaknesses.length > 0 || evaluation.recommendations.length > 0 ? (
        <details className="group">
          <summary className="cursor-pointer select-none text-sm font-medium text-muted-foreground hover:text-foreground list-none flex items-center gap-1">
            <span className="transition-transform group-open:rotate-90">▶</span>
            <span>Advanced details</span>
          </summary>
          <div className="mt-3 space-y-4">
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
        </details>
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
              <>
                <NarrativeFeedbackPanel evaluation={state.evaluation} />
                <NextBestActionPanel evaluation={state.evaluation} />
                <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_320px]">
                  <EvaluationPanel evaluation={state.evaluation} />
                  <EvaluationSidebar evaluation={state.evaluation} session={state.session} />
                </section>
              </>
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
