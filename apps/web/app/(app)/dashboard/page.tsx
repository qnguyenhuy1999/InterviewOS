import type { DashboardProgress } from '@interviewos/types'
import DashboardPage from '@interviewos/ui/pages/DashboardPage'

import { serverApiClient } from '@/lib/server-api-client'

type ReadinessSnapshot = {
  overallScore: number
  confidenceLevel: number
  improvementTrend: number
  breakdown: Array<{
    dimension: string
    label: string
    score: number
    weight: number
    trend: 'UP' | 'DOWN' | 'STABLE'
  }>
}

export default async function Page() {
  const [progress, readiness] = await Promise.all([
    serverApiClient<DashboardProgress>('/analytics/progress').catch(() => null),
    serverApiClient<ReadinessSnapshot>('/readiness/latest').catch(() => null),
  ])

  return (
    <DashboardPage
      empty={!progress}
      progress={progress ?? undefined}
      readiness={readiness ?? undefined}
    />
  )
}
