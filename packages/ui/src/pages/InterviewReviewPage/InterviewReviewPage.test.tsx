import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import InterviewReviewPage from './InterviewReviewPage'
import {
  interviewReviewFixtureEvaluation,
  interviewReviewFixtureSession,
  interviewReviewFixtureTurns,
} from './InterviewReviewPage.fixtures'

describe('InterviewReviewPage', () => {
  it('exposes MetricRow as a static property', () => {
    expect(InterviewReviewPage.MetricRow).toBeTypeOf('function')
  })

  it('renders the loading body for loading state', () => {
    const markup = renderToStaticMarkup(<InterviewReviewPage state={{ kind: 'loading' }} />)

    expect(markup).toContain('h-96')
    expect(markup).toContain('h-64')
  })

  it('renders the ready body with evaluation details', () => {
    const markup = renderToStaticMarkup(
      <InterviewReviewPage
        state={{
          kind: 'ready',
          session: interviewReviewFixtureSession,
          turns: interviewReviewFixtureTurns,
          evaluation: interviewReviewFixtureEvaluation,
        }}
      />,
    )

    expect(markup).toContain('Feedback summary')
    expect(markup).toContain('Conversation replay')
    expect(markup).toContain('Next best action')
  })
})
