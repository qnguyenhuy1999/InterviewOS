import type { InterviewSessionListView } from '@interviewos/types'
import { InterviewPage } from '@interviewos/ui'

import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const sessions = await serverApiClient<InterviewSessionListView[]>('/sessions').catch(
    () => [] as InterviewSessionListView[],
  )

  return (
    <InterviewPage sessions={sessions.length > 0 ? sessions : undefined} empty={sessions.length === 0} />
  )
}
