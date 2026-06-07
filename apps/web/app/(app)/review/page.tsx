import type { ReviewPageView } from '@interviewos/types'

import { ReviewPage } from '@interviewos/ui'

import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const data = await serverApiClient<ReviewPageView>('/review').catch(() => null)
  return <ReviewPage data={data ?? undefined} empty={!data} />
}
