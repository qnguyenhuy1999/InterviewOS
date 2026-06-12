import { Button } from '../../../components/ui/button'
import { EmptyState, PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  INTERVIEW_SESSION_PAGE_DEFAULT_RETRY_LABEL,
  INTERVIEW_SESSION_PAGE_EMPTY_DESCRIPTION,
  INTERVIEW_SESSION_PAGE_EMPTY_TITLE,
  INTERVIEW_SESSION_PAGE_ERROR_TITLE,
  INTERVIEW_SESSION_PAGE_TITLE,
} from './InterviewSessionPage.constants'
import { interviewSessionPageFixture } from './InterviewSessionPage.fixtures'
import type {
  InterviewSessionPageProps,
  InterviewSessionPageSession,
  InterviewSessionPageTurn,
} from './InterviewSessionPage.types'
import {
  formatInterviewSessionDateLabel,
  formatInterviewSessionSignedValue,
  getInterviewSessionCompletedTurns,
  getInterviewSessionHeaderDescription,
  getInterviewSessionReviewLabel,
  getInterviewSessionState,
  isMultiTurnInterviewSession,
} from './InterviewSessionPage.utils'

function ProgressRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
      <SectionCard
        title="Interview room"
        description={getInterviewSessionHeaderDescription(session)}
      >
        <div className="space-y-4">
          {session.summary?.headline ? (
            <div className="rounded-md border border-border/80 bg-background/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Session summary
              </p>
              <p className="mt-2 text-sm leading-6">{session.summary.headline}</p>
            </div>
          ) : null}

          <div className="rounded-md border border-border/80 bg-background/60 p-4">
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
                value={formatInterviewSessionSignedValue(session.readinessImpact.communicationDelta)}
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

function SingleTurnBody({
  session,
  renderAnswerForm,
}: {
  session: InterviewSessionPageSession
  renderAnswerForm?: InterviewSessionPageProps['renderAnswerForm']
}) {
  const question = session.questions[0]
  const answer = question?.answer

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionCard
        title="Question"
        description={`${session.note?.title ?? 'Notebook question'} · Started ${formatInterviewSessionDateLabel(session.createdAt)}`}
      >
        <p className="text-sm text-muted-foreground">
          {question?.question ?? 'Question unavailable'}
        </p>
        <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
          {question?.difficulty ?? 'Unknown'} · {question?.category ?? 'Unknown'} ·{' '}
          {question?.expectedConcepts.join(', ') || 'No concepts'}
        </p>
      </SectionCard>

      <div className="grid gap-6">
        {!answer ? (
          <SectionCard
            title="Practice answer"
            description="Submit your answer to generate feedback and weak concept signals."
          >
            {renderAnswerForm?.({ session }) ?? (
              <p className="text-sm text-muted-foreground">
                Connect an answer form to submit a practice response.
              </p>
            )}
          </SectionCard>
        ) : null}

        {answer?.rawAnswer ? (
          <SectionCard title="Submitted answer" description="Your latest recorded response.">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{answer.rawAnswer}</p>
          </SectionCard>
        ) : null}

        <SectionCard
          title="Technical feedback"
          description="Structured feedback based on your submitted answer."
        >
          {answer?.technicalFeedback ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{answer.technicalFeedback.summary}</p>
              <p>Overall score: {answer.overallScore ?? 'Not scored'}</p>
              <p>Strengths: {answer.technicalFeedback.strengths.join(', ')}</p>
              <p>Improvements: {answer.technicalFeedback.improvements.join(', ')}</p>
              <p>Weak concepts: {answer.weakConcepts.join(', ') || 'None captured'}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Submit your answer to receive technical feedback.
            </p>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <Skeleton className="h-72 rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-md" />
          <Skeleton className="h-40 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-56 rounded-md" />
    </div>
  )
}

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
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

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title={INTERVIEW_SESSION_PAGE_EMPTY_TITLE}
      description={INTERVIEW_SESSION_PAGE_EMPTY_DESCRIPTION}
    />
  )
}

function Root(props: InterviewSessionPageProps) {
  const state = getInterviewSessionState(props)
  const headerSession = state.kind === 'ready' ? state.session : interviewSessionPageFixture.session

  return (
    <>
      <PageHeader
        title={INTERVIEW_SESSION_PAGE_TITLE}
        description={getInterviewSessionHeaderDescription(headerSession)}
      />

      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={props.retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody />
        ) : isMultiTurnInterviewSession(state.session) ? (
          <MultiTurnBody
            session={state.session}
            turns={state.turns}
            reviewHref={props.reviewHref}
            renderMultiTurnForm={props.renderMultiTurnForm}
          />
        ) : (
          <SingleTurnBody session={state.session} renderAnswerForm={props.renderAnswerForm} />
        )}
      </PageBody>
    </>
  )
}

const InterviewSessionPage = Object.assign(Root, {
  ProgressRow,
})

export default InterviewSessionPage
