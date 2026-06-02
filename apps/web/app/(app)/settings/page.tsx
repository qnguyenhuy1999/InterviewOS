export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="target-role">
            Target role
          </label>
          <input
            id="target-role"
            type="text"
            placeholder="e.g. Fullstack Engineer"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="english-level">
            English level
          </label>
          <select
            id="english-level"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Fluent</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="timezone">
            Timezone
          </label>
          <input
            id="timezone"
            type="text"
            placeholder="e.g. America/New_York"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Save settings
        </button>
      </div>
    </div>
  )
}
