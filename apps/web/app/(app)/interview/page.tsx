import { API_ROUTES } from '@interviewos/config'
import type { InterviewSessionListView } from '@interviewos/types'
import InterviewPage from '@interviewos/ui/pages/InterviewPage'

import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const sessions = await serverApiClient<InterviewSessionListView[]>(API_ROUTES.sessions.list).catch(
    () => [] as InterviewSessionListView[],
  )

  return (
    <InterviewPage sessions={sessions.length > 0 ? sessions : undefined} empty={sessions.length === 0} />
  )
}
