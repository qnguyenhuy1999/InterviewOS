import EnglishNotesPage from '@interviewos/ui/pages/EnglishNotesPage'

import { APP_ROUTES } from '@/lib/app-routes'

export default function EnglishNotesLoading() {
  return (
    <EnglishNotesPage
      state={{ kind: 'loading' }}
      actions={{
        reviewLatestHref: APP_ROUTES.review,
        startPracticeHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        retryHref: APP_ROUTES.englishNotes,
      }}
    />
  )
}
