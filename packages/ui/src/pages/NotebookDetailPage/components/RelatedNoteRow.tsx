import type { TechnicalNoteSummary } from '@interviewos/types'

import { StatusDot } from '../../../../components/ui/status'
import { getEnumLabel, getStatusDot } from '../../NotebookPage/NotebookPage.utils'

function RelatedNoteRow({ note }: { note: TechnicalNoteSummary }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-surface-elevated px-4 py-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="min-w-0">
        <p className="text-pretty text-sm leading-6 font-medium text-foreground">{note.title}</p>
        <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
          {note.topic?.trim() || 'Uncategorized'} · {getEnumLabel(note.type)}
        </p>
      </div>
      <div className="text-xs text-right shrink-0 text-muted-foreground">
        <div className="flex items-center justify-end gap-2">
          <StatusDot status={getStatusDot(note.status)} />
          <span>{getEnumLabel(note.status)}</span>
        </div>
        <p className="mt-1">{note.questionCount} questions</p>
      </div>
    </div>
  )
}

export { RelatedNoteRow }
