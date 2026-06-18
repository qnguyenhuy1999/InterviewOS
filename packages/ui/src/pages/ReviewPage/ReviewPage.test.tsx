import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ReviewPage from './ReviewPage'
import { reviewPageFixture } from './ReviewPage.fixtures'

describe('ReviewPage', () => {
  it('preserves static exports', () => {
    expect(ReviewPage.ReviewQueueCard).toBeTypeOf('function')
    expect(ReviewPage.WeakConceptActions).toBeTypeOf('function')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(
      <ReviewPage state={{ kind: 'loading' }} startStudyHref="/review/start" />,
    )

    expect(markup).toContain('min-h-56')
    expect(markup).toContain('h-8')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(
      <ReviewPage
        state={{ kind: 'ready', data: reviewPageFixture }}
        startStudyHref="/review/start"
      />,
    )

    expect(markup).toContain('Learning path')
    expect(markup).toContain('Weak concepts')
    expect(markup).toContain('Mastery')
  })
})
