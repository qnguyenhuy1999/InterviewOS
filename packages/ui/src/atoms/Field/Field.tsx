'use client'

import type { ReactNode } from 'react'

import {
  Field as UiField,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../../components/ui/field'
import { cn } from '../../../lib/utils'

interface FieldProps {
  label: string
  htmlFor?: string
  description?: string
  error?: string
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function Field({
  label,
  htmlFor,
  description,
  error,
  children,
  className,
  contentClassName,
}: FieldProps) {
  return (
    <UiField className={cn('gap-2.5', className)} data-invalid={error ? 'true' : undefined}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      <FieldContent className={contentClassName}>
        {children}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </UiField>
  )
}
