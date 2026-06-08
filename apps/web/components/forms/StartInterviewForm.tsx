'use client'

import { API_ROUTES } from '@interviewos/config'
import {
  type CompanyMode,
  ExperienceLevel,
  InterviewType,
  type NotebookNoteListItem,
  type UserLearningProfile,
} from '@interviewos/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'
import { APP_ROUTES } from '@/lib/app-routes'

type StartInterviewMode = 'STANDARD' | 'MULTI_TURN' | 'COMPANY'

type StartInterviewFormProps = {
  companyModes: CompanyMode[]
  defaultMode: StartInterviewMode
  notes: NotebookNoteListItem[]
  profile: UserLearningProfile
}

const INTERVIEW_TYPE_OPTIONS = Object.values(InterviewType)
const LEVEL_OPTIONS = Object.values(ExperienceLevel)

export function StartInterviewForm({
  companyModes,
  defaultMode,
  notes,
  profile,
}: StartInterviewFormProps) {
  const router = useRouter()
  const [mode, setMode] = useState<StartInterviewMode>(defaultMode)
  const [type, setType] = useState<InterviewType>(InterviewType.TECHNICAL)
  const [noteId, setNoteId] = useState<string>('')
  const [overrideRole, setOverrideRole] = useState(profile.targetRole)
  const [overrideLevel, setOverrideLevel] = useState<ExperienceLevel>(profile.targetLevel)
  const [overrideStack, setOverrideStack] = useState(profile.techStack.join(', '))
  const [maxTurns, setMaxTurns] = useState(defaultMode === 'STANDARD' ? '3' : '5')
  const [companyModeSlug, setCompanyModeSlug] = useState(companyModes[0]?.slug ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const response = await apiFetch(API_ROUTES.sessions.multiTurn, {
        method: 'POST',
        body: JSON.stringify({
          type,
          companyModeSlug: mode === 'COMPANY' ? companyModeSlug || undefined : undefined,
          noteId: noteId || undefined,
          overrideRole: overrideRole.trim() || undefined,
          overrideLevel,
          overrideStack: overrideStack
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          maxTurns: Number(maxTurns) || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const session = (await response.json()) as { id: string }
      router.push(APP_ROUTES.interviewSession(session.id))
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to start the interview.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Start interview</h2>
        <p className="text-sm text-muted-foreground">
          Use your onboarding defaults, pick a note when useful, and start a real interview session.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as StartInterviewMode)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="STANDARD">Standard</option>
            <option value="MULTI_TURN">Multi-turn</option>
            <option value="COMPANY">Company mode</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Interview type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as InterviewType)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            {INTERVIEW_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Target role</span>
          <input
            value={overrideRole}
            onChange={(event) => setOverrideRole(event.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Target level</span>
          <select
            value={overrideLevel}
            onChange={(event) => setOverrideLevel(event.target.value as ExperienceLevel)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            {LEVEL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Max turns</span>
          <input
            type="number"
            min={1}
            max={30}
            value={maxTurns}
            onChange={(event) => setMaxTurns(event.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Topic note</span>
          <select
            value={noteId}
            onChange={(event) => setNoteId(event.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="">No note selected</option>
            {notes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
        </label>

        {mode === 'COMPANY' ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">Company mode</span>
            <select
              value={companyModeSlug}
              onChange={(event) => setCompanyModeSlug(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              {companyModes.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Tech stack</span>
          <input
            value={overrideStack}
            onChange={(event) => setOverrideStack(event.target.value)}
            placeholder="React, TypeScript, PostgreSQL"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {pending ? 'Starting...' : 'Start interview'}
        </button>
        <a
          href={APP_ROUTES.interview}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground"
        >
          Back to sessions
        </a>
      </div>
    </form>
  )
}
