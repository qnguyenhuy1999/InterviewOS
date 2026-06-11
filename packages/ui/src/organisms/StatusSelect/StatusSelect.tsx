'use client'

import { useState } from 'react'

import { NativeSelect, NativeSelectOption } from '../../../components/ui/native-select'

interface StatusSelectProps {
  value: string
  options: string[]
  onUpdate: (nextValue: string) => Promise<void>
}

export function StatusSelect({ value, options, onUpdate }: StatusSelectProps) {
  const [pending, setPending] = useState(false)

  async function updateStatus(nextValue: string) {
    setPending(true)
    try {
      await onUpdate(nextValue)
    } finally {
      setPending(false)
    }
  }

  return (
    <NativeSelect
      value={value}
      disabled={pending}
      onChange={(event) => {
        void updateStatus(event.target.value)
      }}
      className="min-w-36"
    >
      {options.map((option) => (
        <NativeSelectOption key={option} value={option}>
          {option.replaceAll('_', ' ')}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
}
