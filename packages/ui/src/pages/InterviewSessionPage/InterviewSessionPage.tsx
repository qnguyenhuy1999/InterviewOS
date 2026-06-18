import { PageBody, PageHeader } from '../../../components/ui/page'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ProgressRow } from './components/ProgressRow'
import { ReadyBody } from './components/ReadyBody'
import {
  INTERVIEW_SESSION_PAGE_TITLE,
} from './InterviewSessionPage.constants'
import { interviewSessionPageFixture } from './InterviewSessionPage.fixtures'
import type { InterviewSessionPageProps } from './InterviewSessionPage.types'
import { getInterviewSessionHeaderDescription, getInterviewSessionState } from './InterviewSessionPage.utils'

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
        ) : (
          <ReadyBody
            state={state}
            reviewHref={props.reviewHref}
            renderMultiTurnForm={props.renderMultiTurnForm}
            renderAnswerForm={props.renderAnswerForm}
          />
        )}
      </PageBody>
    </>
  )
}

const InterviewSessionPage = Object.assign(Root, {
  ProgressRow,
})

export default InterviewSessionPage
