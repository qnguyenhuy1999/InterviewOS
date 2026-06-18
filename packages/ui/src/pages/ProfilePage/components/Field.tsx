import type React from 'react'

import { Input } from '../../../../components/ui/input'

type FieldProps = {
  label: string
  value: string
  trailing?: React.ReactNode
}

export function Field({ label, value, trailing }: FieldProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-2.5">
        <Input value={value} readOnly className="h-9 rounded-lg px-3 text-sm" />
        {trailing}
      </div>
    </div>
  )
}
