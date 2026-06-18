import { PageBody, PageHeader } from '../../../components/ui/page'
import {
  NOTEBOOK_EDIT_PAGE_DEFAULT_DESCRIPTION,
  NOTEBOOK_EDIT_PAGE_DEFAULT_TITLE,
} from './NotebookEditPage.constants'
import { ErrorBody } from './components/ErrorBody'
import type { NotebookEditPageProps } from './NotebookEditPage.types'

function Root({ error, children }: NotebookEditPageProps) {
  if (error) {
    return (
      <PageBody>
        <ErrorBody error={error} />
      </PageBody>
    )
  }

  return (
    <>
      <PageHeader
        title={NOTEBOOK_EDIT_PAGE_DEFAULT_TITLE}
        description={NOTEBOOK_EDIT_PAGE_DEFAULT_DESCRIPTION}
      />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-6">{children}</div>
      </PageBody>
    </>
  )
}

const NotebookEditPage = Root

export default NotebookEditPage
