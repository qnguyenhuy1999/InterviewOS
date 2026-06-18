import type { ProfilePageProps } from '../ProfilePage.types'

export function ProfileHighlights({ profile }: { profile: NonNullable<ProfilePageProps['profile']> }) {
  const highlights = [
    {
      label: 'Target role',
      value: profile.learningProfile.targetRole.value,
      hint: `${profile.learningProfile.currentLevel.label}: ${profile.learningProfile.currentLevel.value}`,
    },
    {
      label: 'Focus areas',
      value: profile.learningProfile.interviewGoals.items.length,
      hint: profile.learningProfile.interviewGoals.items.join(' • '),
    },
    {
      label: 'Resume status',
      value: profile.resume.latest ? 'Analyzed' : 'Missing',
      hint: profile.resume.latest?.uploadedLabel ?? 'Upload a file to unlock insights',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {highlights.map((item) => (
        <div key={item.label} className="rounded-md border border-border/80 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{item.label}</p>
          <p className="mt-2 font-heading text-xl font-semibold tracking-tight">{item.value}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.hint}</p>
        </div>
      ))}
    </div>
  )
}
