import { HistoryIcon } from 'lucide-react'

import type { ReviewPageReadyState } from '../ReviewPage.types'

function WeakConceptLastSeen({ concept }: { concept: ReviewPageReadyState['data']['weakConcepts'][number] }) {
  if (!concept.lastSeenAt) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const date =
    concept.lastSeenAt instanceof Date ? concept.lastSeenAt : new Date(concept.lastSeenAt)
  const label = Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <HistoryIcon className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export { WeakConceptLastSeen }
