'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        try {
          await apiFetch('/auth/logout', { method: 'POST' })
          router.push('/login')
          router.refresh()
        } finally {
          setPending(false)
        }
      }}
      className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
    >
      {pending ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
