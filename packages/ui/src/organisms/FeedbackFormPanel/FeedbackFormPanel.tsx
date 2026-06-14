import { useEffect, useState } from 'react'

import { FormField } from '../../molecules/FormField'

interface FeedbackFieldDef {
  id: string
  label: string
  type: 'rating' | 'text' | 'textarea'
  required?: boolean
  value: string | number | undefined
}

export interface FeedbackSection {
  id: string
  title: string
  fields: FeedbackFieldDef[]
}

export interface FeedbackFormPanelProps {
  sections: FeedbackSection[]
  onChange: (sectionId: string, fieldId: string, value: string | number) => void
  onSubmit: () => void
  isDraft?: boolean
}

function countRequired(sections: FeedbackSection[]) {
  return sections.flatMap((s) => s.fields).filter((f) => f.required).length
}

function countFilled(sections: FeedbackSection[]) {
  return sections
    .flatMap((s) => s.fields)
    .filter((f) => f.required && f.value !== undefined && f.value !== '').length
}

type SaveState = 'idle' | 'saving' | 'saved'

export function FeedbackFormPanel({
  sections,
  onChange,
  onSubmit,
  isDraft,
}: FeedbackFormPanelProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [saveState, setSaveState] = useState<SaveState>(isDraft ? 'saved' : 'idle')

  const totalRequired = countRequired(sections)
  const filled = countFilled(sections)
  const remaining = totalRequired - filled
  const allFilled = remaining === 0
  const progress = totalRequired > 0 ? Math.round((filled / totalRequired) * 100) : 100

  useEffect(() => {
    if (!isDraft) return
    setSaveState('saving')
    const t = setTimeout(() => setSaveState('saved'), 900)
    return () => clearTimeout(t)
  }, [sections, isDraft])

  function handleFieldChange(sectionId: string, fieldId: string, value: string | number) {
    onChange(sectionId, fieldId, value)
  }

  const section = sections[activeSection]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-interview)',
        borderRadius: 'var(--radius-interview-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border-interview)',
          background: 'var(--color-surface-overlay)',
          flexShrink: 0,
        }}
      >
        <span
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', flex: 1 }}
        >
          Feedback Form
        </span>

        {isDraft && saveState !== 'idle' && (
          <span
            style={{
              fontSize: 11,
              color:
                saveState === 'saving' ? 'var(--color-text-muted)' : 'var(--color-status-live)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {saveState === 'saving' ? 'Saving…' : 'Draft saved'}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--color-surface-inset)', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--color-accent-teal)',
            transition: 'width var(--duration-normal) var(--ease-out-expo)',
          }}
        />
      </div>

      {/* Section tabs */}
      {sections.length > 1 && (
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border-interview)',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {sections.map((s, i) => {
            const sectionFilled = s.fields.filter(
              (f) => f.required && f.value !== undefined && f.value !== '',
            ).length
            const sectionRequired = s.fields.filter((f) => f.required).length
            const sectionComplete = sectionRequired > 0 && sectionFilled === sectionRequired

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(i)}
                style={{
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: activeSection === i ? 600 : 400,
                  color:
                    activeSection === i
                      ? 'var(--color-accent-teal)'
                      : 'var(--color-text-secondary)',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    activeSection === i
                      ? '2px solid var(--color-accent-teal)'
                      : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                {sectionComplete && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--color-status-live)',
                      display: 'inline-block',
                    }}
                  />
                )}
                {s.title}
              </button>
            )
          })}
        </div>
      )}

      {/* Section fields */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {section && (
          <>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {section.title}
            </p>
            {section.fields.map((field) => (
              <FormField
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                required={field.required}
                value={field.value}
                onChange={(v) => handleFieldChange(section.id, field.id, v)}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          padding: '10px 16px',
          borderTop: '1px solid var(--color-border-interview)',
          background: 'var(--color-surface-overlay)',
          flexShrink: 0,
        }}
      >
        {sections.length > 1 && (
          <>
            <button
              type="button"
              disabled={activeSection === 0}
              onClick={() => setActiveSection((i) => i - 1)}
              style={{
                padding: '6px 14px',
                fontSize: 13,
                background: 'none',
                border: '1px solid var(--color-border-interview)',
                borderRadius: 'var(--radius-interview-md)',
                color: 'var(--color-text-secondary)',
                cursor: activeSection === 0 ? 'not-allowed' : 'pointer',
                opacity: activeSection === 0 ? 0.4 : 1,
              }}
            >
              Back
            </button>
            {activeSection < sections.length - 1 && (
              <button
                type="button"
                onClick={() => setActiveSection((i) => i + 1)}
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  background: 'var(--color-surface-inset)',
                  border: '1px solid var(--color-border-interview)',
                  borderRadius: 'var(--radius-interview-md)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            )}
          </>
        )}

        <button
          type="button"
          disabled={!allFilled}
          onClick={onSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 600,
            background: allFilled ? 'var(--color-accent-teal-dim)' : 'var(--color-surface-inset)',
            border: `1px solid ${allFilled ? 'var(--color-accent-teal)' : 'var(--color-border-interview)'}`,
            borderRadius: 'var(--radius-interview-md)',
            color: allFilled ? 'var(--color-accent-teal)' : 'var(--color-text-disabled)',
            cursor: allFilled ? 'pointer' : 'not-allowed',
          }}
        >
          Submit
          {!allFilled && remaining > 0 && (
            <span
              style={{
                fontSize: 10,
                background: 'var(--color-status-warn)',
                color: 'oklch(14% 0.008 240)',
                borderRadius: 'var(--radius-interview-full)',
                padding: '0 5px',
                lineHeight: 1.6,
              }}
            >
              {remaining} remaining
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
