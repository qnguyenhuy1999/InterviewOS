import * as React from 'react'

import { NativeSelect, NativeSelectOption } from '../../components/ui/native-select'
import { cn } from '../../lib/utils'
import { Field } from '../atoms/Field/Field'

type SelectOption = string | { label: string; value: string }

interface FormSelectFieldProps extends Omit<
  React.ComponentProps<typeof NativeSelect>,
  'children' | 'size'
> {
  label: string
  error?: string
  description?: string
  options: readonly SelectOption[]
  register?: Omit<React.ComponentProps<'select'>, 'children' | 'size'>
}

export function FormSelectField({
  label,
  error,
  description,
  options,
  register,
  className,
  id,
  ...props
}: FormSelectFieldProps) {
  const htmlFor = id ?? props.name

  return (
    <Field label={label} htmlFor={htmlFor} error={error} description={description}>
      <NativeSelect
        {...register}
        {...props}
        id={htmlFor}
        aria-invalid={error ? 'true' : undefined}
        className={cn('w-full', className)}
      >
        {options.map((option) => {
          const normalized =
            typeof option === 'string'
              ? { label: option.replaceAll('_', ' '), value: option }
              : option

          return (
            <NativeSelectOption key={normalized.value} value={normalized.value}>
              {normalized.label}
            </NativeSelectOption>
          )
        })}
      </NativeSelect>
    </Field>
  )
}

interface FormNoticeProps extends React.ComponentProps<'div'> {
  variant?: 'error' | 'info' | 'success'
}

export function FormNotice({ className, variant = 'info', ...props }: FormNoticeProps) {
  return (
    <div
      className={cn(
        'rounded-xl border px-3.5 py-3 text-sm leading-6',
        variant === 'error' && 'border-destructive/30 bg-destructive/10 text-destructive',
        variant === 'info' && 'border-border bg-muted text-muted-foreground',
        variant === 'success' && 'border-primary/20 bg-accent-soft text-foreground',
        className,
      )}
      {...props}
    />
  )
}
