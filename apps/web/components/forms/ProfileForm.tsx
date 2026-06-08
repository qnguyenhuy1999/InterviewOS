'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { API_ROUTES } from '@interviewos/config'
import {
  EnglishLevel,
  ExperienceLevel,
  type UpsertUserLearningProfileInput,
  type UserLearningProfile,
} from '@interviewos/types'
import {
  type ProfileUpdateInput,
  profileUpdateSchema,
} from '@interviewos/validators'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import {
  useForm,
  type UseFormRegisterReturn,
} from 'react-hook-form'

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
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      targetRole: initialProfile?.targetRole ?? '',
      currentLevel: initialProfile?.currentLevel ?? ExperienceLevel.MID,
      targetLevel: initialProfile?.targetLevel ?? ExperienceLevel.SENIOR,
      englishLevel: initialProfile?.englishLevel ?? EnglishLevel.INTERMEDIATE,
      techStack: initialProfile?.techStack.join(', ') ?? '',
      interviewGoals: initialProfile?.interviewGoals.join(', ') ?? '',
      preferredOutputStyle: initialProfile?.preferredOutputStyle ?? '',
    },
  })

  async function onSubmit(values: ProfileUpdateInput) {
    setError(null)

    const payload: UpsertUserLearningProfileInput = {
      targetRole: values.targetRole,
      currentLevel: values.currentLevel,
      targetLevel: values.targetLevel,
      englishLevel: values.englishLevel,
      techStack: parseCommaSeparated(values.techStack),
      interviewGoals: parseCommaSeparated(values.interviewGoals),
      preferredOutputStyle: values.preferredOutputStyle,
    }

    try {
      await apiFetch(API_ROUTES.users.learningProfile, {
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
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label="Target role" error={errors.targetRole?.message}>
        <input
          id="targetRole"
          {...register('targetRole')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Current level"
          name="currentLevel"
          options={experienceLevels}
          register={register('currentLevel')}
          error={errors.currentLevel?.message}
        />
        <SelectField
          label="Target level"
          name="targetLevel"
          options={experienceLevels}
          register={register('targetLevel')}
          error={errors.targetLevel?.message}
        />
      </div>

      <SelectField
        label="English level"
        name="englishLevel"
        options={englishLevels}
        register={register('englishLevel')}
        error={errors.englishLevel?.message}
      />

      <Field label="Tech stack" error={errors.techStack?.message}>
        <input
          id="techStack"
          placeholder="TypeScript, React, NestJS"
          {...register('techStack')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Interview goals" error={errors.interviewGoals?.message}>
        <input
          id="interviewGoals"
          placeholder="System design, confidence, senior interviews"
          {...register('interviewGoals')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Preferred output style" error={errors.preferredOutputStyle?.message}>
        <input
          id="preferredOutputStyle"
          placeholder="Concise and practical"
          {...register('preferredOutputStyle')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : mode === 'onboarding' ? 'Complete onboarding' : 'Save settings'}
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
  register,
  error,
}: {
  label: string
  name: string
  options: readonly string[]
  register: UseFormRegisterReturn
  error?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        {...register}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll('_', ' ')}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
