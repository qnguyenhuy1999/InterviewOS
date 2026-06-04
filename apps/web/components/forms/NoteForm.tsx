'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  EnglishLevel,
  ExperienceLevel,
  NoteType,
  type TechnicalNote,
  type UserLearningProfile,
} from '@interviewos/types'
import { type NoteFormInput, noteFormSchema } from '@interviewos/validators'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'

import { apiFetch } from '@/lib/api-client'
import { parseCommaSeparated } from '@/lib/format'

const noteTypes = Object.values(NoteType)
const experienceLevels = Object.values(ExperienceLevel)
const englishLevels = Object.values(EnglishLevel)

export function NoteForm({
  profile,
  note,
}: {
  profile: UserLearningProfile | null
  note?: TechnicalNote | null
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const hasOverrides = Boolean(
    note?.overrideRole ||
    note?.overrideLevel ||
    note?.overrideEnglishLevel ||
    note?.overrideStack.length ||
    note?.overrideGoals.length ||
    note?.preferredOutputStyle,
  )
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      type: note?.type ?? NoteType.CONCEPT,
      title: note?.title ?? '',
      topic: note?.topic ?? '',
      roughNotes: note?.rawInput ?? '',
      advancedEnabled: hasOverrides,
      targetRole: note?.overrideRole ?? profile?.targetRole ?? '',
      targetLevel: note?.overrideLevel ?? profile?.targetLevel ?? ExperienceLevel.SENIOR,
      englishLevel:
        note?.overrideEnglishLevel ?? profile?.englishLevel ?? EnglishLevel.INTERMEDIATE,
      techStack:
        (note?.overrideStack.length ? note.overrideStack : profile?.techStack)?.join(', ') ?? '',
      interviewGoals:
        (note?.overrideGoals.length ? note.overrideGoals : profile?.interviewGoals)?.join(', ') ??
        '',
      preferredOutputStyle: note?.preferredOutputStyle ?? profile?.preferredOutputStyle ?? '',
    },
  })
  const advancedEnabled = watch('advancedEnabled')

  async function onSubmit(values: NoteFormInput) {
    setError(null)

    const payload = {
      title: values.title,
      topic: values.topic.trim() || null,
      roughNotes: values.roughNotes,
      type: values.type,
      advancedSettings: values.advancedEnabled
        ? {
            targetRole: values.targetRole,
            targetLevel: values.targetLevel,
            englishLevel: values.englishLevel,
            techStack: parseCommaSeparated(values.techStack),
            interviewGoals: parseCommaSeparated(values.interviewGoals),
            preferredOutputStyle: values.preferredOutputStyle,
          }
        : note
          ? null
          : undefined,
    }

    try {
      const response = await apiFetch(note ? `/notes/${note.id}` : '/notes', {
        method: note ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const savedNote = (await response.json()) as { id: string }
      router.push(`/notebook/${savedNote.id}`)
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : note
            ? 'Unable to save note.'
            : 'Unable to create note.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Using your onboarding defaults</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile
            ? `${profile.targetRole} / ${profile.targetLevel} / ${profile.techStack.join(', ')}`
            : 'Complete onboarding to unlock AI defaults for note generation.'}
        </p>
      </div>

      <SelectField
        label="Note type"
        name="type"
        options={noteTypes}
        register={register('type')}
        error={errors.type?.message}
      />

      <Field label="Title or topic" error={errors.title?.message}>
        <input
          id="title"
          placeholder="e.g. Redis caching strategies"
          {...register('title')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Organization topic" error={errors.topic?.message}>
        <input
          id="topic"
          placeholder="e.g. Caching, React, System Design"
          {...register('topic')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Rough notes" error={errors.roughNotes?.message}>
        <textarea
          id="roughNotes"
          rows={12}
          placeholder="Paste bullet points, pain points, tradeoffs, examples, and what still feels weak."
          {...register('roughNotes')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      <details className="rounded-xl border border-border bg-card" open={advancedEnabled}>
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
          Advanced settings
        </summary>
        <div className="space-y-4 border-t border-border px-4 py-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('advancedEnabled')} />
            Enable per-note overrides
          </label>
          <Field label="Target role" error={errors.targetRole?.message}>
            <input
              id="targetRole"
              {...register('targetRole')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Target level"
              name="targetLevel"
              options={experienceLevels}
              register={register('targetLevel')}
              error={errors.targetLevel?.message}
            />
            <SelectField
              label="English level"
              name="englishLevel"
              options={englishLevels}
              register={register('englishLevel')}
              error={errors.englishLevel?.message}
            />
          </div>
          <Field label="Tech stack" error={errors.techStack?.message}>
            <input
              id="techStack"
              placeholder="Node.js, PostgreSQL"
              {...register('techStack')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Interview goals" error={errors.interviewGoals?.message}>
            <input
              id="interviewGoals"
              placeholder="Architecture depth, stronger storytelling"
              {...register('interviewGoals')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Preferred output style" error={errors.preferredOutputStyle?.message}>
            <input
              id="preferredOutputStyle"
              placeholder="Clear, structured, production-oriented"
              {...register('preferredOutputStyle')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </details>

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
        {isSubmitting
          ? note
            ? 'Saving note...'
            : 'Creating note...'
          : note
            ? 'Save note'
            : 'Create note'}
      </button>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
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
