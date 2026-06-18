import { EmptyState } from '../../../../components/ui/page'

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-80"
      title="No settings available"
      description="Add settings sections to start configuring your workspace."
    />
  )
}

export { EmptyBody }
