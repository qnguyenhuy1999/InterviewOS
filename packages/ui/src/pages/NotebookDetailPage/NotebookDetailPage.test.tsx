import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import NotebookDetailPage from './NotebookDetailPage'

describe('NotebookDetailPage', () => {
  it('renders a back action ahead of the note title when provided', () => {
    const markup = renderToStaticMarkup(
      <NotebookDetailPage backAction={<button type="button">Back to notebook</button>} />,
    )

    expect(markup).toContain('Back to notebook')
  })
})
