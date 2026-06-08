import type * as React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  cta?: React.ReactNode
}

export function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h2 className="font-heading text-lg font-medium">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {cta && <div className="mt-1">{cta}</div>}
    </div>
  )
}
