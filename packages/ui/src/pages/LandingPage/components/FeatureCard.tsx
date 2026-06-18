import type React from 'react'

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated">
      <div className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-accent-soft text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/10">
        <Icon className="size-4" />
      </div>
      <div className="space-y-1.5">
        <p className="font-heading text-sm font-semibold tracking-tight text-foreground">{title}</p>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export { FeatureCard }
