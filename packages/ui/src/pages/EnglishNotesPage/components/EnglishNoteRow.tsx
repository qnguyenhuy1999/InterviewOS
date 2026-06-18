import type React from 'react'

import { Badge } from '../../../../components/ui/badge'
import { ENGLISH_NOTES_STATUS_LABEL } from '../EnglishNotesPage.constants'
import type { ReadyEnglishNotesState } from '../EnglishNotesPage.types'
import { getEnglishRelativeDateLabel, getEnglishStatusClassName } from '../EnglishNotesPage.utils'

type EnglishNoteRowProps = ReadyEnglishNotesState['notes'][number] & {
  renderActions?: React.ReactNode
}

export function EnglishNoteRow({
  originalSentence,
  correctedSentence,
  naturalVersion,
  explanation,
  status,
  createdAt,
  renderActions,
}: EnglishNoteRowProps) {
  return (
    <article className="group rounded-lg border border-border/70 bg-card transition-shadow duration-150 hover:shadow-elevated">
      <div className="space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Original
            </p>
            <p className="text-sm font-medium leading-6 text-foreground">{originalSentence}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Corrected
            </p>
            <p className="text-sm leading-6 text-foreground">{correctedSentence}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Natural version
            </p>
            <p className="text-sm leading-6 text-muted-foreground">{naturalVersion}</p>
          </div>
        </div>

        <div className="h-px bg-border/60" />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">{explanation}</p>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xs text-muted-foreground/70">
              {getEnglishRelativeDateLabel(createdAt)}
            </span>
            {renderActions ?? (
              <Badge variant="outline" className={getEnglishStatusClassName(status)}>
                {ENGLISH_NOTES_STATUS_LABEL[status]}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
