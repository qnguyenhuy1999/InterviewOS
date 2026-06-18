import { LanguagesIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

export function EmptyBody({ startPracticeHref }: { startPracticeHref: string }) {
  return (
    <EmptyState
      className="min-h-96"
      icon={LanguagesIcon}
      title="No English corrections yet"
      description="Complete an interview session to start collecting targeted English feedback."
      action={
        <Button asChild>
          <a href={startPracticeHref}>Start practice</a>
        </Button>
      }
    />
  )
}
