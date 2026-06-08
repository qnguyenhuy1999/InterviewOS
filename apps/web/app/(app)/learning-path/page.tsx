import type { LearningPathItem } from '@interviewos/types'
import LearningPathPage from '@interviewos/ui/pages/LearningPathPage'

import { LearningPathActions } from '@/components/forms/LearningPathActions'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page() {
  const items = await serverApiClient<LearningPathItem[]>('/learning-path').catch(
    () => [] as LearningPathItem[],
  )

  return (
    <LearningPathPage
      items={items.length > 0 ? items : undefined}
      empty={items.length === 0}
      renderItemActions={(item) => <LearningPathActions itemId={item.id} />}
    />
  )
}
