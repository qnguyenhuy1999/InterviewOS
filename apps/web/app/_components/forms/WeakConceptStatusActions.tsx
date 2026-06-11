'use client'

import { API_ROUTES } from '@interviewos/config'
import type { WeakConceptStatus } from '@interviewos/types'
import { WeakConceptStatusActions as WeakConceptStatusActionsUI } from '@interviewos/ui/organisms/WeakConceptStatusActions'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function WeakConceptStatusActions({ weakConceptId }: { weakConceptId: string }) {
  const router = useRouter()

  async function handleUpdateStatus(status: WeakConceptStatus) {
    const response = await apiFetch(API_ROUTES.review.weakConceptStatus(weakConceptId), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return <WeakConceptStatusActionsUI onUpdateStatus={handleUpdateStatus} />
}
