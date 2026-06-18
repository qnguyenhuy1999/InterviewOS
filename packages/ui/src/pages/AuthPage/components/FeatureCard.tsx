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
    <div className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
      <div className="flex size-8 items-center justify-center rounded-xl border border-border/60 bg-accent-soft text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/10">
        <Icon className="size-3.5" />
      </div>
      <div className="space-y-1">
        <p className="font-heading text-xs font-semibold tracking-tight text-foreground">{title}</p>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export { FeatureCard }
