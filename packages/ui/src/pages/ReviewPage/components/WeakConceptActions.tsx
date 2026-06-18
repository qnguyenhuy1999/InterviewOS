import { CircleCheckIcon, XIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import type { ReviewPageReadyState } from '../ReviewPage.types'
import { getWeakConceptActions } from '../ReviewPage.utils'

function WeakConceptActions({ concept }: { concept: ReviewPageReadyState['data']['weakConcepts'][number] }) {
  const actions = getWeakConceptActions(concept.status)
  const canResolve = actions.includes('resolve')
  const canIgnore = actions.includes('ignore')

  return (
    <div className="flex items-center justify-end gap-2">
      {canResolve && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-success hover:bg-success-soft hover:text-success"
        >
          <CircleCheckIcon className="size-3.5" aria-hidden="true" />
          Resolve
        </Button>
      )}
      {canIgnore && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-error-soft hover:text-destructive"
        >
          <XIcon className="size-3.5" aria-hidden="true" />
          Ignore
        </Button>
      )}
    </div>
  )
}

export { WeakConceptActions }
