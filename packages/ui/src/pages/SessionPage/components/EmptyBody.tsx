import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title="No active sessions"
      description="New devices and browsers will appear here after they sign in to your account."
      action={<Button>Back to dashboard</Button>}
    />
  )
}

export { EmptyBody }
