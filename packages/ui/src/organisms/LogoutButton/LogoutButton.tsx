'use client'

import { useState } from 'react'

import { Button } from '../../../components/ui/button'

export interface LogoutButtonProps {
  onLogout: () => Promise<void>
  onSuccess?: () => void
}

export function LogoutButton({ onLogout, onSuccess }: LogoutButtonProps) {
  const [pending, setPending] = useState(false)

  return (
    <Button
      type="button"
      disabled={pending}
      variant="outline"
      size="sm"
      onClick={async () => {
        setPending(true)
        try {
          await onLogout()
          onSuccess?.()
        } finally {
          setPending(false)
        }
      }}
    >
      {pending ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
