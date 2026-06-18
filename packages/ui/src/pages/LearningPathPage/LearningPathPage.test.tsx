import { LearningPathItemStatus } from '@interviewos/types'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import LearningPathPage from './LearningPathPage'
import { learningPathFixture } from './LearningPathPage.fixtures'
import type { LearningPathPageProps } from './LearningPathPage.types'

const baseProps: Omit<LearningPathPageProps, 'state'> = {
  reviewQueueHref: '/review',
  focusModeHref: '/focus-mode',
  retryHref: '/learning-path',
}

describe('LearningPathPage', () => {
  it('exposes LearningPathListItem as a static property', () => {
    expect(LearningPathPage.LearningPathListItem).toBeTypeOf('function')
  })

  it('renders the loading body for loading state', () => {
    const markup = renderToStaticMarkup(
      <LearningPathPage state={{ kind: 'loading' }} {...baseProps} />,
    )

    expect(markup).toContain('Learning path')
    expect(markup).toContain('h-36')
  })

  it('renders the ready body for ready state', () => {
    const markup = renderToStaticMarkup(
      <LearningPathPage
        state={{
          kind: 'ready',
          items: [
            {
              ...learningPathFixture.items[0],
              title: 'Review dependency injection',
              reason: 'Recent misses show repeated confusion about constructor injection.',
              status: LearningPathItemStatus.PENDING,
            },
          ],
        }}
        {...baseProps}
      />,
    )

    expect(markup).toContain('Today&#x27;s focus')
    expect(markup).toContain('Coverage by type')
    expect(markup).toContain('Review dependency injection')
  })
})
