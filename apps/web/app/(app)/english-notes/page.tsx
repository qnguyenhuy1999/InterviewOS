import { type EnglishNote, EnglishNoteStatus } from '@interviewos/types'

import { StatusSelect } from '@/components/forms/StatusSelect'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

export default async function EnglishNotesPage() {
  const notes = await serverApiClient<EnglishNote[]>('/english-notes').catch(() => [])
  const topics = groupByTopic(notes)
  const masteredCount = notes.filter((note) => note.status === EnglishNoteStatus.MASTERED).length
  const masteryPercentage = notes.length > 0 ? Math.round((masteredCount / notes.length) * 100) : 0

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total notes" value={String(notes.length)} />
        <StatCard label="Total topics" value={String(topics.length)} />
        <StatCard label="Mastery percentage" value={`${masteryPercentage}%`} />
      </section>

      <section className="space-y-4">
        {topics.map((topic) => (
          <details key={topic.name} className="rounded-xl border border-border bg-card" open>
            <summary className="cursor-pointer list-none px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-base font-medium">{topic.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topic.total} occurrences / {topic.mastered} mastered / {topic.needsPractice} needs practice
                  </p>
                </div>
                <div className="min-w-40 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mastery</span>
                    <span className="font-medium">{topic.masteryPercentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${topic.masteryPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </summary>
            <div className="space-y-3 border-t border-border px-4 py-4">
              {topic.notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{note.originalSentence}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Corrected: {note.correctedSentence}
                      </p>
                      <p className="text-sm text-muted-foreground">Natural: {note.naturalVersion}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <StatusSelect
                      endpoint={`/english-notes/${note.id}/status`}
                      value={note.status}
                      options={Object.values(EnglishNoteStatus)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-2xl font-medium">{value}</p>
    </div>
  )
}

function groupByTopic(notes: EnglishNote[]) {
  const grouped = new Map<string, EnglishNote[]>()

  for (const note of notes) {
    const topicName = note.grammarTopic.trim() || 'Other'
    const current = grouped.get(topicName)
    if (current) {
      current.push(note)
    } else {
      grouped.set(topicName, [note])
    }
  }

  return Array.from(grouped.entries())
    .map(([name, topicNotes]) => {
      const mastered = topicNotes.filter((note) => note.status === EnglishNoteStatus.MASTERED).length
      const needsPractice = topicNotes.length - mastered

      return {
        name,
        notes: topicNotes,
        total: topicNotes.length,
        mastered,
        needsPractice,
        masteryPercentage: Math.round((mastered / topicNotes.length) * 100),
      }
    })
    .sort((left, right) => right.total - left.total || left.name.localeCompare(right.name))
}
