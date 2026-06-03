'use client'

import {
  EnglishLevel,
  ExperienceLevel,
  type InterviewSession,
  type UserLearningProfile,
} from '@interviewos/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'
import { parseCommaSeparated } from '@/lib/format'

const experienceLevels = Object.values(ExperienceLevel)
const englishLevels = Object.values(EnglishLevel)

export function InterviewAnswerForm({
  session,
  profile,
}: {
  session: Pick<
    InterviewSession,
    | 'id'
    | 'overrideRole'
    | 'overrideLevel'
    | 'overrideStack'
    | 'overrideGoals'
    | 'overrideEnglishLevel'
    | 'preferredOutputStyle'
  >
  profile: UserLearningProfile
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasOverrides = Boolean(
    session.overrideRole ||
      session.overrideLevel ||
      session.overrideEnglishLevel ||
      session.overrideStack.length ||
      session.overrideGoals.length ||
      session.preferredOutputStyle,
  )

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    const advancedEnabled = formData.get('advancedEnabled') === 'on'

    try {
      const response = await apiFetch(`/sessions/${session.id}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          answer: String(formData.get('answer') ?? ''),
          advancedSettings: advancedEnabled
            ? {
                targetRole: String(formData.get('targetRole') ?? ''),
                targetLevel: String(
                  formData.get('targetLevel') ?? profile.targetLevel,
                ) as ExperienceLevel,
                englishLevel: String(
                  formData.get('englishLevel') ?? profile.englishLevel,
                ) as EnglishLevel,
                techStack: parseCommaSeparated(String(formData.get('techStack') ?? '')),
                interviewGoals: parseCommaSeparated(
                  String(formData.get('interviewGoals') ?? ''),
                ),
                preferredOutputStyle: String(formData.get('preferredOutputStyle') ?? ''),
              }
            : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to submit answer.',
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
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="answer">
          Your answer
        </label>
        <textarea
          id="answer"
          name="answer"
          rows={10}
          placeholder="Write your interview answer in English. Focus on structure, tradeoffs, and one concrete example."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <details className="rounded-xl border border-border bg-card" open={hasOverrides}>
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
          Advanced session settings
        </summary>
        <div className="space-y-4 border-t border-border px-4 py-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="advancedEnabled" defaultChecked={hasOverrides} />
            Override onboarding defaults for this session
          </label>
          <Field
            label="Target role"
            name="targetRole"
            defaultValue={session.overrideRole ?? profile.targetRole}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Target level"
              name="targetLevel"
              defaultValue={session.overrideLevel ?? profile.targetLevel}
              options={experienceLevels}
            />
            <SelectField
              label="English level"
              name="englishLevel"
              defaultValue={session.overrideEnglishLevel ?? profile.englishLevel}
              options={englishLevels}
            />
          </div>
          <Field
            label="Tech stack"
            name="techStack"
            defaultValue={(session.overrideStack.length ? session.overrideStack : profile.techStack).join(', ')}
          />
          <Field
            label="Interview goals"
            name="interviewGoals"
            defaultValue={
              (session.overrideGoals.length ? session.overrideGoals : profile.interviewGoals).join(
                ', ',
              )
            }
          />
          <Field
            label="Preferred output style"
            name="preferredOutputStyle"
            defaultValue={session.preferredOutputStyle ?? profile.preferredOutputStyle}
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
        {pending ? 'Evaluating answer...' : 'Submit answer'}
      </button>
    </form>
  )
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
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
