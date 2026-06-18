import { Button } from '../../../../components/ui/button'
import type { InterviewReviewPageProps, InterviewReviewReadyState } from '../InterviewReviewPage.types'
import { getInterviewReviewPendingMessage } from '../InterviewReviewPage.utils'
import { ConversationReplay } from './ConversationReplay'
import { EvaluationPanel } from './EvaluationPanel'
import { EvaluationSidebar } from './EvaluationSidebar'
import { NarrativeFeedbackPanel } from './NarrativeFeedbackPanel'
import { NextBestActionPanel } from './NextBestActionPanel'

function ReadyBody({
  state,
  sessionHref,
  allSessionsHref,
}: {
  state: InterviewReviewReadyState
  sessionHref?: InterviewReviewPageProps['sessionHref']
  allSessionsHref?: InterviewReviewPageProps['allSessionsHref']
}) {
  return (
    <>
      {state.evaluation ? (
        <>
          <NarrativeFeedbackPanel evaluation={state.evaluation} />
          <NextBestActionPanel evaluation={state.evaluation} />
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EvaluationPanel evaluation={state.evaluation} />
            </div>
            <EvaluationSidebar evaluation={state.evaluation} session={state.session} />
          </section>
        </>
      ) : (
        <section className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          {getInterviewReviewPendingMessage(state.session.status)}
        </section>
      )}

      <ConversationReplay turns={state.turns} />

      {sessionHref || allSessionsHref ? (
        <div className="flex items-center gap-4 text-sm">
          {sessionHref ? (
            <Button asChild variant="link" className="h-auto px-0">
              <a href={sessionHref}>Back to session</a>
            </Button>
          ) : null}
          {allSessionsHref ? (
            <Button asChild variant="link" className="h-auto px-0 text-muted-foreground">
              <a href={allSessionsHref}>All sessions</a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export { ReadyBody }
