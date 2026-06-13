import clsx from 'clsx'
import type { FormFieldProps } from './FormField.types'

export function FormFieldMolecule({
  label,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  const subtext = error ?? hint

  return (
    <div className={clsx(className)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-status-error)', marginLeft: 2 }}>*</span>}
      </label>

      {children}

      {subtext && (
        <p
          style={{
            fontSize: 12,
            color: error ? 'var(--color-status-error)' : 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  )
}
