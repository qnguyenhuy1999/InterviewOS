import type * as React from 'react'

type FieldLabelProps = {
  label: React.ReactNode
  description?: React.ReactNode
}

function FieldLabel({ label, description }: FieldLabelProps) {
  return (
    <div className="space-y-1">
      <p className="text-base font-medium text-foreground">{label}</p>
      {description ? <p className="max-w-xs text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}

export { FieldLabel }
