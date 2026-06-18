import { EnglishNoteStatus } from '@interviewos/types'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import EnglishNotesPage from './EnglishNotesPage'
import { englishNotesFixture } from './EnglishNotesPage.fixtures'
import type { EnglishNotesPageProps } from './EnglishNotesPage.types'

const actions: EnglishNotesPageProps['actions'] = {
  reviewLatestHref: '/english-notes/review-latest',
  startPracticeHref: '/interviews/new',
  retryHref: '/english-notes',
}

describe('EnglishNotesPage', () => {
  it('exposes EnglishNoteRow as a static property', () => {
    expect(EnglishNotesPage.EnglishNoteRow).toBeTypeOf('function')
  })

  it('renders the loading body for loading state', () => {
    const markup = renderToStaticMarkup(
      <EnglishNotesPage state={{ kind: 'loading' }} actions={actions} />,
    )

    expect(markup).toContain('English notes')
    expect(markup).toContain('h-56')
  })

  it('renders the error body for error state', () => {
    const markup = renderToStaticMarkup(
      <EnglishNotesPage
        state={{ kind: 'error', message: 'Network issue' }}
        actions={actions}
      />,
    )

    expect(markup).toContain('Failed to load English notes')
    expect(markup).toContain('Network issue')
    expect(markup).toContain('Retry')
  })

  it('renders the ready body for ready state', () => {
    const markup = renderToStaticMarkup(
      <EnglishNotesPage
        state={{
          kind: 'ready',
          notes: [
            {
              ...englishNotesFixture.notes[0],
              status: EnglishNoteStatus.NEEDS_PRACTICE,
              grammarTopic: 'Prepositions',
            },
          ],
        }}
        actions={actions}
      />,
    )

    expect(markup).toContain('Topic coverage')
    expect(markup).toContain('Corrections')
    expect(markup).toContain('Prepositions')
  })
})
