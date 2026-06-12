import type { OnboardingPageProps } from './OnboardingPage.types'

function Root({ reason, children }: OnboardingPageProps) {
  return (
    <div className="mx-auto max-w-lg space-y-7 px-4 pt-3 md:space-y-9 md:px-6 md:pt-4">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Set up your profile</h2>
        <p className="text-sm text-muted-foreground">Step 1 of 1: Profile</p>
      </div>
      {reason ? (
        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
          {reason}
        </div>
      ) : null}
      {children}
    </div>
  )
}

const OnboardingPage = Root

export default OnboardingPage
