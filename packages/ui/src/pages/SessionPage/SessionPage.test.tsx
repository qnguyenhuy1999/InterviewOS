import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import SessionPage from './SessionPage'
import { sessionPageFixture } from './SessionPage.fixtures'

describe('SessionPage', () => {
  it('preserves static exports', () => {
    expect(SessionPage.SessionRow).toBeTypeOf('function')
    expect(SessionPage.SessionsCard).toBeTypeOf('function')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(<SessionPage loading />)

    expect(markup).toContain('h-28')
    expect(markup).toContain('min-h-40')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(
      <SessionPage sessions={sessionPageFixture.sessions} />,
    )

    expect(markup).toContain('Active sessions')
    expect(markup).toContain('Signed-in devices')
    expect(markup).toContain('Security tips')
  })
})
