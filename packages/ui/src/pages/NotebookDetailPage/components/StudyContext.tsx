import type { TechnicalNoteDetailView } from '@interviewos/types'
import ReactMarkdown from 'react-markdown'

import { DefinitionList } from '../../../molecules/DefinitionList/DefinitionList'
import { TagList } from '../../../molecules/TagList/TagList'
import { NoteSection } from '../../../organisms/NoteSection/NoteSection'
import { getNotebookDetailInterviewTargets } from '../NotebookDetailPage.utils'

function StudyContext({ data }: { data: TechnicalNoteDetailView }) {
  const interviewTargets = getNotebookDetailInterviewTargets(data.note)

  return (
    <div className="flex flex-col gap-7 md:gap-9">
      <NoteSection
        id="study-context"
        title="Interview targeting"
        description="The audience and constraints that shaped this note."
        tone="muted"
        className="order-2"
      >
        <div className="space-y-5">
          <DefinitionList items={interviewTargets} />

          {data.note.overrideGoals.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Goals
              </p>
              <TagList
                items={data.note.overrideGoals}
                className="mt-3"
                badgeClassName="rounded-full px-2.5 py-1"
              />
            </div>
          ) : null}

          {data.note.overrideStack.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Stack
              </p>
              <TagList
                items={data.note.overrideStack}
                className="mt-3"
                variant="outline"
                badgeClassName="rounded-full px-2.5 py-1"
              />
            </div>
          ) : null}
        </div>
      </NoteSection>

      <NoteSection
        id="source-note"
        title="Source note"
        description="The original raw capture before it was shaped into a study article."
        tone="muted"
        className="order-1"
      >
        <article className="prose prose-neutral max-w-none wrap-break-word prose-p:text-pretty prose-p:leading-7 prose-headings:text-balance dark:prose-invert">
          <ReactMarkdown>{data.note.rawInput}</ReactMarkdown>
        </article>
      </NoteSection>
    </div>
  )
}

export { StudyContext }
