import type { ReactNode } from 'react'

type ActionItemProps = {
  href: string
  label: string
  icon: ReactNode
  primary?: boolean
}

export function ActionItem({ href, label, icon, primary = false }: ActionItemProps) {
  const base =
    'flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
  const variant = primary
    ? 'border-primary/30 bg-accent-soft text-primary hover:bg-accent-soft/70'
    : 'border-border bg-muted text-foreground hover:bg-accent-soft hover:border-primary/30 hover:text-primary'

  return (
    <a href={href} className={`${base} ${variant}`}>
      <span className="size-4 shrink-0 opacity-70 [&>svg]:size-4">{icon}</span>
      {label}
    </a>
  )
}
