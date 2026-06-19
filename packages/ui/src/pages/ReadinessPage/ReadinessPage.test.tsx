import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ReadinessPage from './ReadinessPage'
import { readinessPageFixture } from './ReadinessPage.fixtures'

describe('ReadinessPage', () => {
  it('preserves static exports', () => {
    expect(ReadinessPage.DimensionRow).toBeTypeOf('function')
    expect(ReadinessPage.HistoryRow).toBeTypeOf('function')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(<ReadinessPage loading />)

    expect(markup).toContain('h-72')
    expect(markup).toContain('h-80')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(<ReadinessPage data={readinessPageFixture} />)

    expect(markup).toContain('Current readiness')
    expect(markup).toContain('Dimension breakdown')
    expect(markup).toContain('History')
  })

  it('renders recovery actions only when routes are provided', () => {
    const emptyMarkup = renderToStaticMarkup(<ReadinessPage empty />)
    const emptyWithAction = renderToStaticMarkup(<ReadinessPage empty startPracticeHref="/interview/start" />)
    const errorWithAction = renderToStaticMarkup(
      <ReadinessPage error="Unable to load analytics." retryHref="/readiness" />,
    )

    expect(emptyMarkup).not.toContain('Start practice')
    expect(emptyWithAction).toContain('Start practice')
    expect(emptyWithAction).toContain('href="/interview/start"')
    expect(errorWithAction).toContain('Try again')
    expect(errorWithAction).toContain('href="/readiness"')
  })
})
