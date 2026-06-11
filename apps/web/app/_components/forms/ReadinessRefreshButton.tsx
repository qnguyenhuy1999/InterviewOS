'use client'

import { API_ROUTES } from '@interviewos/config'
import { ReadinessRefreshButton as ReadinessRefreshButtonUI } from '@interviewos/ui/organisms/ReadinessRefreshButton'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function ReadinessRefreshButton() {
  const router = useRouter()

  async function handleRefresh() {
    const response = await apiFetch(API_ROUTES.readiness.compute, { method: 'POST' })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return <ReadinessRefreshButtonUI onRefresh={handleRefresh} />
}
