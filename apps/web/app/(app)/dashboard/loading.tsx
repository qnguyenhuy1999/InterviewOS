import DashboardPage from '@interviewos/ui/pages/DashboardPage'

import { APP_ROUTES } from '@/lib/app-routes'

export default function DashboardLoading() {
  return (
    <DashboardPage
      state={{ kind: 'loading' }}
      actions={{
        createNoteHref: APP_ROUTES.notebookNew,
        startInterviewHref: APP_ROUTES.interviewStart,
        quickStartHref: `${APP_ROUTES.interviewStart}?mode=quick`,
        allNotesHref: APP_ROUTES.notebook,
        allSessionsHref: APP_ROUTES.interview,
        englishNotesHref: APP_ROUTES.englishNotes,
        reviewQueueHref: APP_ROUTES.review,
        readinessHref: APP_ROUTES.readiness,
        retryHref: APP_ROUTES.dashboard,
      }}
    />
  )
}
