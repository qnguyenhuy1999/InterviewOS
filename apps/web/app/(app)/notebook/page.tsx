import type { TechnicalNote } from '@interviewos/types'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { EmptyState } from '@/components/empty-states/EmptyState'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

const UNCATEGORIZED_TOPIC = 'Uncategorized'

export default async function NotebookPage({
  searchParams,
}: {
  searchParams?: Promise<{ topic?: string }>
}) {
  const notes = await serverApiClient<TechnicalNote[]>('/notes').catch(() => [])
  const selectedTopic = normalizeTopic((await searchParams)?.topic)

  if (notes.length === 0) {
    return (
      <EmptyState
        title="No notes yet"
        description="Create your first note to start building your interview knowledge base."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
          </svg>
        }
        cta={
          <Link
            href="/notebook/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Create note
          </Link>
        }
      />
    )
  }

  const topicSummaries = buildTopicSummaries(notes)
  const visibleGroups = selectedTopic
    ? topicSummaries.filter((group) => group.name === selectedTopic)
    : topicSummaries

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-medium">Smart Technical Notebook</h2>
          <p className="text-sm text-muted-foreground">
            Capture rough notes, generate structured content, and review by topic instead of a flat
            list.
          </p>
        </div>
        <Link
          href="/notebook/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New note
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total notes" value={String(notes.length)} />
        <StatCard label="Topics" value={String(topicSummaries.length)} />
        <StatCard
          label="Uncategorized"
          value={String(
            topicSummaries.find((group) => group.name === UNCATEGORIZED_TOPIC)?.notes.length ?? 0,
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <TopicFilterChip href="/notebook" active={!selectedTopic}>
          All topics
        </TopicFilterChip>
        {topicSummaries.map((group) => (
          <TopicFilterChip
            key={group.name}
            href={`/notebook?topic=${encodeURIComponent(group.name)}`}
            active={selectedTopic === group.name}
          >
            {group.name} ({group.notes.length})
          </TopicFilterChip>
        ))}
      </div>

      <div className="space-y-4">
        {visibleGroups.map((group) => (
          <section key={group.name} className="rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4">
              <div>
                <h3 className="font-heading text-base font-medium">{group.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.notes.length} note{group.notes.length === 1 ? '' : 's'} in this topic
                </p>
              </div>
              <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                Latest update {formatDate(group.lastUpdatedAt)}
              </div>
            </div>
            <div className="grid gap-4 p-4">
              {group.notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notebook/${note.id}`}
                  className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-medium">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {note.type.replaceAll('_', ' ')} | {note.status.replaceAll('_', ' ')} |
                        Updated {formatDate(note.updatedAt)}
                      </p>
                    </div>
                    <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {note.structuredContent ? 'AI generated' : 'Draft'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function normalizeTopic(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function buildTopicSummaries(notes: TechnicalNote[]) {
  const grouped = new Map<string, TechnicalNote[]>()

  for (const note of notes) {
    const topic = normalizeTopic(note.topic) ?? UNCATEGORIZED_TOPIC
    const current = grouped.get(topic)
    if (current) {
      current.push(note)
      continue
    }
    grouped.set(topic, [note])
  }

  return Array.from(grouped.entries())
    .map(([name, topicNotes]) => ({
      name,
      notes: topicNotes,
      lastUpdatedAt: topicNotes.reduce(
        (latest, note) => (new Date(note.updatedAt) > latest ? new Date(note.updatedAt) : latest),
        new Date(topicNotes[0]?.updatedAt ?? Date.now()),
      ),
    }))
    .sort((left, right) => {
      if (left.name === UNCATEGORIZED_TOPIC) {
        return 1
      }
      if (right.name === UNCATEGORIZED_TOPIC) {
        return -1
      }
      return left.name.localeCompare(right.name)
    })
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-2xl font-medium">{value}</p>
    </div>
  )
}

function TopicFilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  )
}
