export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Set up your profile</h2>
        <p className="text-sm text-muted-foreground">Step 1 of 1: Profile</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="role">
            Target role
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Fullstack Engineer"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="english">
            English level
          </label>
          <select
            id="english"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Fluent</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="goal">
            Interview goal
          </label>
          <input
            id="goal"
            type="text"
            placeholder="e.g. FAANG preparation"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Continue
        </button>
      </div>
    </div>
  )
}
