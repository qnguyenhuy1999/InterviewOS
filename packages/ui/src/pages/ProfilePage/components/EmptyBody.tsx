import { EmptyState, PageStateAction } from '../../../../components/ui/page'

export function EmptyBody({ setupProfileHref }: { setupProfileHref?: string }) {
  return (
    <EmptyState
      className="min-h-96"
      title="No profile data yet"
      description="Account details, learning preferences, and resume insights will appear here once your profile is configured."
      action={
        setupProfileHref ? (
          <PageStateAction href={setupProfileHref} label="Set up profile" />
        ) : undefined
      }
    />
  )
}
