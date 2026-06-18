import { PageBody, PageHeader } from '../../../components/ui/page'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { MetricRow } from './components/MetricRow'
import { ReadyBody } from './components/ReadyBody'
import { INTERVIEW_REVIEW_PAGE_TITLE } from './InterviewReviewPage.constants'
import { interviewReviewPageFixture } from './InterviewReviewPage.fixtures'
import type { InterviewReviewPageProps } from './InterviewReviewPage.types'
import { getInterviewReviewHeaderDescription, getInterviewReviewState } from './InterviewReviewPage.utils'

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
          <ErrorBody message={state.message} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody />
        ) : (
          <ReadyBody
            state={state}
            sessionHref={props.sessionHref}
            allSessionsHref={props.allSessionsHref}
          />
        )}
      </PageBody>
    </>
  )
}

const InterviewReviewPage = Object.assign(Root, {
  MetricRow,
})

export default InterviewReviewPage
