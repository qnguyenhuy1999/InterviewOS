'use client'

import {
  EnglishLevel,
  ExperienceLevel,
  NoteType,
  type UserLearningProfile,
} from '@interviewos/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { absoluteApiPath } from '@/lib/api-client'
import { parseCommaSeparated } from '@/lib/format'

const noteTypes = Object.values(NoteType)
const experienceLevels = Object.values(ExperienceLevel)
const englishLevels = Object.values(EnglishLevel)

export function NoteForm({ profile }: { profile: UserLearningProfile | null }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    const advancedEnabled = formData.get('advancedEnabled') === 'on'
    const payload = {
      title: String(formData.get('title') ?? ''),
      roughNotes: String(formData.get('roughNotes') ?? ''),
      type: String(formData.get('type') ?? NoteType.CONCEPT),
      advancedSettings: advancedEnabled
        ? {
            targetRole: String(formData.get('targetRole') ?? ''),
            targetLevel: String(formData.get('targetLevel') ?? ''),
            englishLevel: String(formData.get('englishLevel') ?? ''),
            techStack: parseCommaSeparated(String(formData.get('techStack') ?? '')),
            interviewGoals: parseCommaSeparated(String(formData.get('interviewGoals') ?? '')),
            preferredOutputStyle: String(formData.get('preferredOutputStyle') ?? ''),
          }
        : undefined,
    }

    try {
      const response = await fetch(absoluteApiPath('/notes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const note = (await response.json()) as { id: string }
      router.push(`/notebook/${note.id}`)
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to create note.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      action={(formData) => {
        void handleSubmit(formData)
      }}
      className="space-y-6"
    >
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Using your onboarding defaults</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile
            ? `${profile.targetRole} · ${profile.targetLevel} · ${profile.techStack.join(', ')}`
            : 'Complete onboarding to unlock AI defaults for note generation.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="title">
          Title or topic
        </label>
        <input
          id="title"
          name="title"
          placeholder="e.g. Redis caching strategies"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="roughNotes">
          Rough notes
        </label>
        <textarea
          id="roughNotes"
          name="roughNotes"
          rows={12}
          placeholder="Paste bullet points, pain points, tradeoffs, examples, and what still feels weak."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <details className="rounded-xl border border-border bg-card">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
          Advanced settings
        </summary>
        <div className="space-y-4 border-t border-border px-4 py-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="advancedEnabled" />
            Enable per-note overrides
          </label>
          <SelectField
            label="Note type"
            name="type"
            defaultValue={NoteType.CONCEPT}
            options={noteTypes}
          />
          <Field label="Target role" name="targetRole" defaultValue={profile?.targetRole} />
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Target level"
              name="targetLevel"
              defaultValue={profile?.targetLevel ?? ExperienceLevel.SENIOR}
              options={experienceLevels}
            />
            <SelectField
              label="English level"
              name="englishLevel"
              defaultValue={profile?.englishLevel ?? EnglishLevel.INTERMEDIATE}
              options={englishLevels}
            />
          </div>
          <Field
            label="Tech stack"
            name="techStack"
            defaultValue={profile?.techStack.join(', ')}
            placeholder="Node.js, PostgreSQL"
          />
          <Field
            label="Interview goals"
            name="interviewGoals"
            defaultValue={profile?.interviewGoals.join(', ')}
            placeholder="Architecture depth, stronger storytelling"
          />
          <Field
            label="Preferred output style"
            name="preferredOutputStyle"
            defaultValue={profile?.preferredOutputStyle}
            placeholder="Clear, structured, production-oriented"
          />
        </div>
      </details>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? 'Creating note...' : 'Create note'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue: string
  options: readonly string[]
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll('_', ' ')}
          </option>
        ))}
      </select>
    </div>
  )
}
