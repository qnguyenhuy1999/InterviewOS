'use client'

import { StatusSelect as StatusSelectUI } from '@interviewos/ui/organisms/StatusSelect'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function StatusSelect({
  endpoint,
  value,
  options,
}: {
  endpoint: string
  value: string
  options: string[]
}) {
  const router = useRouter()

  async function handleUpdate(nextValue: string) {
    if (!endpoint.startsWith('/')) return
    const response = await apiFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextValue }),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return <StatusSelectUI value={value} options={options} onUpdate={handleUpdate} />
}
