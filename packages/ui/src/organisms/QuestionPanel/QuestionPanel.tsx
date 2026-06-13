import clsx from 'clsx'

import { InterviewQuestionCard } from '../../molecules/InterviewQuestionCard'
import type { QuestionPanelProps } from './QuestionPanel.types'

export function QuestionPanel({ questions, activeId, onSelect, className }: QuestionPanelProps) {
  const active = questions.find((q) => q.id === activeId)
  const rest = questions.filter((q) => q.id !== activeId)

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
          Questions ({questions.length})
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex flex-col gap-2 p-2 overflow-y-auto" style={{ maxHeight: 480 }}>
        {/* Active question expanded at top */}
        {active && (
          <InterviewQuestionCard
            question={active.question}
            category={active.category}
            difficulty={active.difficulty}
            timeEstimate={active.timeEstimate}
            isActive
            variant="active"
            onSelect={() => onSelect(active.id)}
          />
        )}

        {/* Rest compact */}
        {rest.map((q) => (
          <InterviewQuestionCard
            key={q.id}
            question={q.question}
            category={q.category}
            difficulty={q.difficulty}
            timeEstimate={q.timeEstimate}
            isActive={false}
            variant="compact"
            onSelect={() => onSelect(q.id)}
          />
        ))}
      </div>
    </div>
  )
}
