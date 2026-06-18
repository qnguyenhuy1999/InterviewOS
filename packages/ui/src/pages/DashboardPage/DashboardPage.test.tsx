import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import DashboardPage from './DashboardPage'
import type { DashboardPageProps } from './DashboardPage.types'

const actions: DashboardPageProps['actions'] = {
  createNoteHref: '/notes/new',
  startInterviewHref: '/interviews/new',
  quickStartHref: '/interviews/quick-start',
  allNotesHref: '/notes',
  allSessionsHref: '/sessions',
  englishNotesHref: '/english-notes',
  reviewQueueHref: '/review',
  readinessHref: '/readiness',
  retryHref: '/dashboard',
}

describe('DashboardPage', () => {
  it('exposes MetricCard as a static property', () => {
    expect(DashboardPage.MetricCard).toBeTypeOf('function')
  })

  it('renders the loading body for loading state', () => {
    const markup = renderToStaticMarkup(
      <DashboardPage state={{ kind: 'loading' }} actions={actions} />,
    )

    expect(markup).toContain('Loading dashboard')
    expect(markup).toContain('Preparing your progress overview...')
  })

  it('renders the error body for error state', () => {
    const markup = renderToStaticMarkup(
      <DashboardPage
        state={{ kind: 'error', message: 'Network issue' }}
        actions={actions}
      />,
    )

    expect(markup).toContain('Failed to load dashboard')
    expect(markup).toContain('Network issue')
    expect(markup).toContain('Retry')
  })
})
