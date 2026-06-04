import type { InterviewSession } from '@interviewos/types'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-states/EmptyState'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

type SessionListItem = InterviewSession & {
  note: { title: string } | null
  companyMode?: { name: string } | null
  evaluation?: { overallScore: number | null } | null
  summary?: { headline: string } | null
  readinessImpact?: { overallDelta: number } | null
  questions: Array<{
    id: string
    question: string
    answer: { id: string; overallScore: number | null; weakConcepts: string[] } | null
  }>
}

export default async function InterviewPage() {
  const sessions = await serverApiClient<SessionListItem[]>('/sessions').catch(() => [])

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No interview sessions yet"
        description="Start your first practice session from a generated note question."
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
        cta={
          <Link
            href="/notebook"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to notebook
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const score = session.evaluation?.overallScore ?? session.questions[0]?.answer?.overallScore ?? null

        return (
          <Link
            key={session.id}
            href={`/interview/session/${session.id}`}
            className="block rounded-xl border border-border bg-card p-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-base font-medium">
                  {session.questions[0]?.question ?? session.summary?.headline ?? 'Practice session'}
                </h2>
                <span className="text-xs text-muted-foreground">{session.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {session.companyMode?.name ?? session.note?.title ?? 'Interview session'} · {session.mode ?? 'STANDARD'} · {score != null ? 'Evaluated' : 'In progress'} · Created {formatDate(session.createdAt)} · {score != null ? `Score ${score}` : 'No score yet'}
              </p>
              {session.summary?.headline ? (
                <p className="text-sm text-muted-foreground">{session.summary.headline}</p>
              ) : null}
              {session.questions[0]?.answer?.weakConcepts.length ? (
                <p className="text-sm text-muted-foreground">
                  Weak concepts: {session.questions[0].answer.weakConcepts.join(', ')}
                </p>
              ) : null}
              {session.readinessImpact ? (
                <p className="text-sm text-muted-foreground">
                  Readiness impact: {session.readinessImpact.overallDelta > 0 ? '+' : ''}
                  {session.readinessImpact.overallDelta}
                </p>
              ) : null}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
