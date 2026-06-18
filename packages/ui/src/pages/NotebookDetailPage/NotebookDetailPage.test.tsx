import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import NotebookDetailPage from './NotebookDetailPage'
import { notebookDetailFixture } from './NotebookDetailPage.fixtures'

describe('NotebookDetailPage', () => {
  it('preserves static exports', () => {
    expect(NotebookDetailPage.QuestionCard).toBeTypeOf('function')
    expect(NotebookDetailPage.RelatedNoteRow).toBeTypeOf('function')
  })

  it('renders a back action ahead of the note title when provided', () => {
    const markup = renderToStaticMarkup(
      <NotebookDetailPage backAction={<button type="button">Back to notebook</button>} />,
    )

    expect(markup).toContain('Back to notebook')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(<NotebookDetailPage loading />)

    expect(markup).toContain('h-56')
    expect(markup).toContain('h-72')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(<NotebookDetailPage data={notebookDetailFixture} />)

    expect(markup).toContain('Notebook detail')
    expect(markup).toContain('Practice questions')
    expect(markup).toContain('Related notes')
  })
})
