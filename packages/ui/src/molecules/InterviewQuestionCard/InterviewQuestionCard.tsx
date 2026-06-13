import clsx from 'clsx'
import { Clock } from 'lucide-react'
import type * as React from 'react'

import type { InterviewQuestionCardProps, QuestionDifficulty } from './InterviewQuestionCard.types'

function getDifficultyStyle(difficulty: QuestionDifficulty): React.CSSProperties {
  switch (difficulty) {
    case 'easy':
      return { color: 'var(--color-status-live)', borderColor: 'var(--color-status-live)' }
    case 'medium':
      return { color: 'var(--color-status-warn)', borderColor: 'var(--color-status-warn)' }
    case 'hard':
      return { color: 'var(--color-status-error)', borderColor: 'var(--color-status-error)' }
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function InterviewQuestionCard({
  question,
  category,
  difficulty,
  timeEstimate,
  tags = [],
  isActive = false,
  variant = 'compact',
  onSelect,
  className,
}: InterviewQuestionCardProps) {
  const isClickable = Boolean(onSelect)
  const diffStyle = getDifficultyStyle(difficulty)
  const showActive = isActive || variant === 'active'

  const containerStyle: React.CSSProperties = showActive
    ? {
        borderColor: 'var(--color-accent-teal)',
        backgroundColor: 'var(--color-accent-teal-glow)',
      }
    : {
        borderColor: 'var(--color-border-interview)',
        backgroundColor: 'var(--color-surface-raised)',
      }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }

  return (
    <div
      role={isClickable ? 'button' : undefined}
      aria-pressed={isClickable ? isActive : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={clsx(
        'rounded-xl border px-4 py-3 transition-colors duration-150',
        isClickable && 'cursor-pointer',
        className,
      )}
      style={containerStyle}
    >
      {/* Header: category chip + difficulty badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-border-interview-subtle)',
            border: '1px solid var(--color-border-interview)',
          }}
        >
          {capitalize(category)}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={diffStyle}>
          {capitalize(difficulty)}
        </span>
      </div>

      {/* Question text */}
      <p className="text-sm font-medium leading-5" style={{ color: 'var(--color-text-primary)' }}>
        {question}
      </p>

      {/* Expanded / active extras */}
      {(variant === 'expanded' || variant === 'active') && (
        <>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border-interview)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {timeEstimate !== undefined && (
            <div
              className="flex items-center gap-1 mt-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Clock size={12} />
              <span className="text-xs">{timeEstimate} min</span>
            </div>
          )}
        </>
      )}

      {/* Compact: time estimate if present */}
      {variant === 'compact' && timeEstimate !== undefined && (
        <div className="flex items-center gap-1 mt-2" style={{ color: 'var(--color-text-muted)' }}>
          <Clock size={12} />
          <span className="text-xs">{timeEstimate} min</span>
        </div>
      )}
    </div>
  )
}
