import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import InterviewSessionPage from './InterviewSessionPage'
import { interviewSessionPageFixture } from './InterviewSessionPage.fixtures'

describe('InterviewSessionPage', () => {
  it('exposes ProgressRow as a static property', () => {
    expect(InterviewSessionPage.ProgressRow).toBeTypeOf('function')
  })

  it('renders the loading body for loading state', () => {
    const markup = renderToStaticMarkup(<InterviewSessionPage state={{ kind: 'loading' }} />)

    expect(markup).toContain('h-72')
    expect(markup).toContain('h-56')
  })

  it('renders the ready body for multi-turn sessions', () => {
    const markup = renderToStaticMarkup(
      <InterviewSessionPage
        state={{
          kind: 'ready',
          session: interviewSessionPageFixture.session,
          turns: interviewSessionPageFixture.turns,
        }}
        reviewHref="/sessions/1/review"
      />,
    )

    expect(markup).toContain('Interview room')
    expect(markup).toContain('Readiness impact')
    expect(markup).toContain('Connect a multi-turn response form to continue this interview.')
  })
})
