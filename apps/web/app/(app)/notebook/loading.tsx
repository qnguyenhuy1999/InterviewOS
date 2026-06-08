import NotebookPage from '@interviewos/ui/pages/NotebookPage'

import { APP_ROUTES } from '@/lib/app-routes'

export default function NotebookLoading() {
  return (
    <NotebookPage
      state={{ kind: 'loading' }}
      actions={{
        createNoteHref: APP_ROUTES.notebookNew,
        noteHref: APP_ROUTES.notebookDetail,
        retryHref: APP_ROUTES.notebook,
      }}
    />
  )
}
