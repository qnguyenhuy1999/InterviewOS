import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

export function EmptyBody() {
  return (
    <EmptyState
      className="min-h-96"
      title="No profile data yet"
      description="Account details, learning preferences, and resume insights will appear here once your profile is configured."
      action={<Button>Set up profile</Button>}
    />
  )
}
