import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import InterviewPage from './InterviewPage'
import { interviewPageFixture } from './InterviewPage.fixtures'
import type { InterviewPageProps } from './InterviewPage.types'

const actions: InterviewPageProps['actions'] = {
  startInterviewHref: '/interviews/new',
  quickStartHref: '/interviews/quick-start',
  reviewHref: '/interviews',
  retryHref: '/interviews',
}

describe('InterviewPage', () => {
  it('preserves static exports', () => {
    expect(InterviewPage.SessionRow).toBeTypeOf('function')
    expect(InterviewPage.SessionsTable).toBeTypeOf('function')
    expect(InterviewPage.TopicFilter).toBeTypeOf('function')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(
      <InterviewPage state={{ kind: 'loading' }} actions={actions} />,
    )

    expect(markup).toContain('h-11')
    expect(markup).toContain('min-h-72')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(
      <InterviewPage
        state={{ kind: 'ready', sessions: interviewPageFixture.sessions }}
        actions={actions}
      />,
    )

    expect(markup).toContain('Interview sessions')
    expect(markup).toContain('Sessions run')
    expect(markup).toContain('Review')
  })
})
