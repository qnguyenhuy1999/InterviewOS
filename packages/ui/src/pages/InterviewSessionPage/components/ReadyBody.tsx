import type { InterviewSessionPageProps, InterviewSessionReadyState } from '../InterviewSessionPage.types'
import { isMultiTurnInterviewSession } from '../InterviewSessionPage.utils'
import { MultiTurnBody } from './MultiTurnBody'
import { SingleTurnBody } from './SingleTurnBody'

function ReadyBody({
  state,
  reviewHref,
  renderMultiTurnForm,
  renderAnswerForm,
}: {
  state: InterviewSessionReadyState
  reviewHref?: InterviewSessionPageProps['reviewHref']
  renderMultiTurnForm?: InterviewSessionPageProps['renderMultiTurnForm']
  renderAnswerForm?: InterviewSessionPageProps['renderAnswerForm']
}) {
  return isMultiTurnInterviewSession(state.session) ? (
    <MultiTurnBody
      session={state.session}
      turns={state.turns}
      reviewHref={reviewHref}
      renderMultiTurnForm={renderMultiTurnForm}
    />
  ) : (
    <SingleTurnBody session={state.session} renderAnswerForm={renderAnswerForm} />
  )
}

export { ReadyBody }
