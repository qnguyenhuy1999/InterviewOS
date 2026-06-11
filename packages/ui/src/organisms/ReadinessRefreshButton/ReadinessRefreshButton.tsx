'use client'

import { RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../../components/ui/button'

interface ReadinessRefreshButtonProps {
  onRefresh: () => Promise<void>
}

export function ReadinessRefreshButton({ onRefresh }: ReadinessRefreshButtonProps) {
  const [pending, setPending] = useState(false)

  async function handleClick() {
    setPending(true)
    try {
      await onRefresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => {
        void handleClick()
      }}
      disabled={pending}
    >
      <RotateCcwIcon className="size-4" />
      {pending ? 'Refreshing...' : 'Recompute readiness'}
    </Button>
  )
}
