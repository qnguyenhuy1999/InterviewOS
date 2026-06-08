import type * as React from 'react'

type FieldLabelProps = {
  label: React.ReactNode
  description?: React.ReactNode
}

function FieldLabel({ label, description }: FieldLabelProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description ? <p className="max-w-xs text-xs text-muted-foreground">{description}</p> : null}
    </div>
  )
}

export { FieldLabel }
