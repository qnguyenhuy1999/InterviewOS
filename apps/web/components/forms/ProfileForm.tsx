'use client'

import {
  EnglishLevel,
  ExperienceLevel,
  type UpsertUserLearningProfileInput,
  type UserLearningProfile,
} from '@interviewos/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'
import { parseCommaSeparated } from '@/lib/format'

const experienceLevels = Object.values(ExperienceLevel)
const englishLevels = Object.values(EnglishLevel)

type ProfileFormProps = {
  initialProfile: UserLearningProfile | null
  mode: 'onboarding' | 'settings'
}

export function ProfileForm({ initialProfile, mode }: ProfileFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    const payload: UpsertUserLearningProfileInput = {
      targetRole: String(formData.get('targetRole') ?? ''),
      currentLevel: String(formData.get('currentLevel') ?? ExperienceLevel.MID) as ExperienceLevel,
      targetLevel: String(formData.get('targetLevel') ?? ExperienceLevel.SENIOR) as ExperienceLevel,
      englishLevel: String(
        formData.get('englishLevel') ?? EnglishLevel.INTERMEDIATE,
      ) as EnglishLevel,
      techStack: parseCommaSeparated(String(formData.get('techStack') ?? '')),
      interviewGoals: parseCommaSeparated(String(formData.get('interviewGoals') ?? '')),
      preferredOutputStyle: String(formData.get('preferredOutputStyle') ?? ''),
    }

    try {
      await apiFetch('/users/me/profile', {
        method: initialProfile ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text())
        }
      })

      router.push(mode === 'onboarding' ? '/notebook' : '/settings')
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to save profile.',
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
      className="space-y-5"
    >
      <Field label="Target role" name="targetRole" defaultValue={initialProfile?.targetRole} />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Current level"
          name="currentLevel"
          defaultValue={initialProfile?.currentLevel ?? ExperienceLevel.MID}
          options={experienceLevels}
        />
        <SelectField
          label="Target level"
          name="targetLevel"
          defaultValue={initialProfile?.targetLevel ?? ExperienceLevel.SENIOR}
          options={experienceLevels}
        />
      </div>

      <SelectField
        label="English level"
        name="englishLevel"
        defaultValue={initialProfile?.englishLevel ?? EnglishLevel.INTERMEDIATE}
        options={englishLevels}
      />

      <Field
        label="Tech stack"
        name="techStack"
        defaultValue={initialProfile?.techStack.join(', ')}
        placeholder="TypeScript, React, NestJS"
      />
      <Field
        label="Interview goals"
        name="interviewGoals"
        defaultValue={initialProfile?.interviewGoals.join(', ')}
        placeholder="System design, confidence, senior interviews"
      />
      <Field
        label="Preferred output style"
        name="preferredOutputStyle"
        defaultValue={initialProfile?.preferredOutputStyle}
        placeholder="Concise and practical"
      />

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
        {pending ? 'Saving...' : mode === 'onboarding' ? 'Complete onboarding' : 'Save settings'}
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
