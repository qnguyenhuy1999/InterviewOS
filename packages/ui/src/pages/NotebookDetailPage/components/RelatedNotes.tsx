import type { TechnicalNoteDetailView } from '@interviewos/types'

import { EmptyState } from '../../../../components/ui/page'
import { NoteSection } from '../../../organisms/NoteSection/NoteSection'
import { RelatedNoteRow } from './RelatedNoteRow'

function RelatedNotes({ data }: { data: TechnicalNoteDetailView }) {
  return (
    <NoteSection
      id="related-notes"
      title="Related notes"
      description="Nearby topics worth reviewing before or after this one."
      tone="muted"
    >
      {data.relatedNotes.length > 0 ? (
        <div className="space-y-3">
          {data.relatedNotes.map((note) => (
            <RelatedNoteRow key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="border-dashed min-h-48 bg-background"
          title="No related notes yet"
          description="As your notebook grows, supporting topics will show up here."
        />
      )}
    </NoteSection>
  )
}

export { RelatedNotes }
