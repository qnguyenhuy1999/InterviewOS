import { PageBody, PageHeader } from '../../../components/ui/page'
import type { NotebookEditPageProps } from './NotebookEditPage.types'

const DEFAULT_TITLE = 'Edit note'
const DEFAULT_DESCRIPTION =
  'Update the note content and decide whether this note should keep its own overrides.'

function Root({ error, children }: NotebookEditPageProps) {
  if (error) {
    return (
      <PageBody>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </PageBody>
    )
  }

  return (
    <>
      <PageHeader title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-6">{children}</div>
      </PageBody>
    </>
  )
}

const NotebookEditPage = Root

export default NotebookEditPage
