import { RatingScale } from '../RatingScale'

export interface FormFieldProps {
  id: string
  label: string
  type: 'rating' | 'text' | 'textarea'
  required?: boolean
  value: string | number | undefined
  onChange: (value: string | number) => void
}

const inputStyle: React.CSSProperties = {
  background: 'var(--color-surface-inset)',
  border: '1px solid var(--color-border-interview)',
  borderRadius: 'var(--radius-interview-md)',
  color: 'var(--color-text-primary)',
  padding: '8px 10px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export function FormField({ id, label, type, required, value, onChange }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        htmlFor={type !== 'rating' ? id : undefined}
        style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-status-error)', marginLeft: 2 }}>*</span>}
      </label>

      {type === 'rating' && (
        <RatingScale
          value={
            typeof value === 'number' && value >= 1 && value <= 5
              ? (value as 1 | 2 | 3 | 4 | 5)
              : null
          }
          onChange={(v) => onChange(v)}
        />
      )}

      {type === 'text' && (
        <input
          id={id}
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}

      {type === 'textarea' && (
        <textarea
          id={id}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
        />
      )}
    </div>
  )
}
