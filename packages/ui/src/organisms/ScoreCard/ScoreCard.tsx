import clsx from 'clsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { RatingScale } from '../../molecules/RatingScale'
import type { ScoreCardProps, ScoreSection } from './ScoreCard.types'

function scoreRowBackground(score: 1 | 2 | 3 | 4 | 5 | null): React.CSSProperties {
  if (score === null) return {}
  return {
    backgroundColor: `color-mix(in oklch, var(--color-score-${score}) 8%, transparent)`,
    transition: 'background-color 200ms',
  }
}

function computeAverage(sections: ScoreSection[]): number | null {
  const scores = sections
    .flatMap((s) => s.criteria)
    .map((c) => c.score)
    .filter((s): s is 1 | 2 | 3 | 4 | 5 => s !== null)

  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

interface SectionGroupProps {
  section: ScoreSection
  onChange: ScoreCardProps['onChange']
}

function SectionGroup({ section, onChange }: SectionGroupProps) {
  const [open, setOpen] = React.useState(true)

  return (
    <div style={{ borderBottom: '1px solid var(--color-border-interview)' }}>
      {/* Section header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left"
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {section.title}
        </span>
      </button>

      {/* Criteria rows */}
      {open && (
        <div>
          {section.criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-center justify-between gap-4 px-3 py-2"
              style={scoreRowBackground(criterion.score)}
            >
              <span
                className="text-sm flex-1 min-w-0"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {criterion.label}
              </span>
              <RatingScale
                value={criterion.score}
                variant="compact"
                onChange={(score) => onChange(section.id, criterion.id, score)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ScoreCard({ sections, onChange, className }: ScoreCardProps) {
  const avg = computeAverage(sections)

  return (
    <div
      className={clsx('flex flex-col', className)}
      style={{
        backgroundColor: 'var(--color-surface-base)',
        border: '1px solid var(--color-border-interview)',
        borderRadius: 'var(--radius-interview-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center px-3 py-2"
        style={{ borderBottom: '1px solid var(--color-border-interview)' }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Score Card
        </span>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <SectionGroup key={section.id} section={section} onChange={onChange} />
        ))}
      </div>

      {/* Footer: overall average */}
      <div
        className="flex items-center justify-between px-3 py-3"
        style={{ borderTop: '1px solid var(--color-border-interview)' }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Overall
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono-interview)',
            fontSize: 22,
            fontWeight: 700,
            color:
              avg !== null ? `var(--color-score-${Math.round(avg)})` : 'var(--color-text-disabled)',
            letterSpacing: '-0.02em',
          }}
        >
          {avg !== null ? avg.toFixed(1) : '—'}
        </span>
      </div>
    </div>
  )
}
