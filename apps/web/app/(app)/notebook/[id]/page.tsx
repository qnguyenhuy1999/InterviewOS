import {
  type NoteGeneratedQuestion,
  NoteStatus,
  type TechnicalNote,
  type TechnicalNoteContent,
} from '@interviewos/types'
import Link from 'next/link'

import { NoteActions } from '@/components/forms/NoteActions'
import { StartPracticeButton } from '@/components/forms/StartPracticeButton'
import { StatusSelect } from '@/components/forms/StatusSelect'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

type NoteDetail = TechnicalNote & {
  questions: NoteGeneratedQuestion[]
}

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = await serverApiClient<NoteDetail>(`/notes/${id}`).catch(() => null)

  if (!note) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this note.
      </div>
    )
  }

  const content = note.structuredContent as TechnicalNoteContent | null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">{note.title}</h2>
        <p className="text-sm text-muted-foreground">
          {note.type.replaceAll('_', ' ')} | Updated {formatDate(note.updatedAt)} | Status{' '}
          {note.status.replaceAll('_', ' ')}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Generation settings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Role: {note.overrideRole ?? 'Onboarding default'} | Level{' '}
              {note.overrideLevel ?? 'Onboarding default'} | English{' '}
              {note.overrideEnglishLevel ?? 'Onboarding default'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusSelect
              endpoint={`/notes/${note.id}`}
              value={note.status}
              options={Object.values(NoteStatus)}
            />
            <Link
              href={`/notebook/${note.id}/edit`}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Rough notes</p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{note.rawInput}</p>
      </div>

      <NoteActions noteId={note.id} canGenerateQuestions={Boolean(note.structuredContent)} />

      {content ? (
        <div className="grid gap-4">
          <SectionCard title="Purpose" body={content.purpose} />
          <ListSection title="Quick Reference" items={content.quickReference} />
          <ListSection title="Core Concepts" items={content.coreConcepts} />
          <SectionCard title="Mental Model" body={content.mentalModel} />
          <ListSection title="Production Usage" items={content.productionUsage} />
          <ListSection title="Practical Examples" items={content.practicalExamples} />
          <ListSection title="Common Pitfalls" items={content.commonPitfalls} />
          <ListSection title="Debugging Checklist" items={content.debuggingChecklist} />
          <ListSection title="Production Checklist" items={content.productionChecklist} />
          <ListSection title="Senior Interview Signals" items={content.seniorInterviewSignals} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Generate the AI technical note to turn your rough notes into the standardized format.
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-lg font-medium">Generated Interview Questions</h3>
          <p className="text-sm text-muted-foreground">
            Practice directly from the note once questions are generated.
          </p>
        </div>
        {note.questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No generated questions yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {note.questions.map((question) => (
              <div key={question.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{question.question}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {question.difficulty} | {question.category} | {question.sourceSection}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expected concepts: {question.expectedConcepts.join(', ')}
                    </p>
                  </div>
                  <StartPracticeButton generatedQuestionId={question.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SectionCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </section>
  )
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading text-base font-medium">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-muted/50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
