'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CompanyMode,
  ExperienceLevel,
  InterviewType,
  type NotebookNoteListItem,
  type UserLearningProfile,
} from '@interviewos/types'
import { parseCommaSeparated } from '@interviewos/utils'
import {
  type StartMultiTurnSessionFormInput,
  startMultiTurnSessionFormSchema,
} from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice, FormSelectField } from '../../lib/form-ui'

type StartInterviewMode = 'STANDARD' | 'MULTI_TURN' | 'COMPANY'

type StartInterviewPayload = {
  type: InterviewType
  companyModeSlug?: string
  noteId?: string
  overrideRole?: string
  overrideLevel: ExperienceLevel
  overrideStack: string[]
  maxTurns?: number
}

interface StartInterviewFormProps {
  companyModes: CompanyMode[]
  defaultMode: StartInterviewMode
  notes: NotebookNoteListItem[]
  profile: UserLearningProfile
  backHref: string
  onSubmit: (payload: StartInterviewPayload) => Promise<void>
}

const INTERVIEW_TYPE_OPTIONS = Object.values(InterviewType)
const LEVEL_OPTIONS = Object.values(ExperienceLevel)

export function StartInterviewForm({
  companyModes,
  defaultMode,
  notes,
  profile,
  backHref,
  onSubmit,
}: StartInterviewFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StartMultiTurnSessionFormInput>({
    resolver: zodResolver(startMultiTurnSessionFormSchema),
    defaultValues: {
      type: InterviewType.TECHNICAL,
      mode: defaultMode,
      companyModeSlug: companyModes[0]?.slug ?? '',
      noteId: '',
      overrideRole: profile.targetRole,
      overrideLevel: profile.targetLevel,
      overrideStack: profile.techStack.join(', '),
      maxTurns: defaultMode === 'STANDARD' ? 3 : 5,
    },
  })
  const mode = watch('mode')

  async function handleFormSubmit(values: StartMultiTurnSessionFormInput) {
    setError(null)

    const payload: StartInterviewPayload = {
      type: values.type,
      companyModeSlug: values.mode === 'COMPANY' ? values.companyModeSlug || undefined : undefined,
      noteId: values.noteId || undefined,
      overrideRole: values.overrideRole || undefined,
      overrideLevel: values.overrideLevel,
      overrideStack: parseCommaSeparated(values.overrideStack),
      maxTurns: Number(values.maxTurns) || undefined,
    }

    try {
      await onSubmit(payload)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to start the interview.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Start interview</CardTitle>
          <CardDescription>
            Use your onboarding defaults, pick a note when useful, and start a real interview
            session with clearer role and stack context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormSelectField
              label="Mode"
              name="mode"
              options={['STANDARD', 'MULTI_TURN', 'COMPANY']}
              register={register('mode')}
              error={errors.mode?.message}
            />

            <FormSelectField
              label="Interview type"
              name="type"
              options={INTERVIEW_TYPE_OPTIONS}
              register={register('type')}
              error={errors.type?.message}
            />

            <Field
              label="Target role"
              htmlFor="overrideRole"
              error={errors.overrideRole?.message}
              className="md:col-span-2"
            >
              <Input
                id="overrideRole"
                {...register('overrideRole')}
                aria-invalid={errors.overrideRole?.message ? 'true' : undefined}
                className="w-full"
              />
            </Field>

            <FormSelectField
              label="Target level"
              name="overrideLevel"
              options={LEVEL_OPTIONS}
              register={register('overrideLevel')}
              error={errors.overrideLevel?.message}
            />

            <Field label="Max turns" htmlFor="maxTurns" error={errors.maxTurns?.message}>
              <Input
                id="maxTurns"
                type="number"
                min={1}
                max={30}
                {...register('maxTurns', { valueAsNumber: true })}
                aria-invalid={errors.maxTurns?.message ? 'true' : undefined}
                className="w-full"
              />
            </Field>

            <FormSelectField
              label="Topic note"
              name="noteId"
              options={[
                { label: 'No note selected', value: '' },
                ...notes.map((note) => ({ label: note.title, value: note.id })),
              ]}
              register={register('noteId')}
              error={errors.noteId?.message}
              className="md:col-span-2"
            />

            {mode === 'COMPANY' ? (
              <FormSelectField
                label="Company mode"
                name="companyModeSlug"
                options={companyModes.map((item) => ({ label: item.name, value: item.slug }))}
                register={register('companyModeSlug')}
                error={errors.companyModeSlug?.message}
                className="md:col-span-2"
              />
            ) : null}

            <Field
              label="Tech stack"
              htmlFor="overrideStack"
              error={errors.overrideStack?.message}
              className="md:col-span-2"
              description="Separate technologies with commas to keep the prompt readable."
            >
              <Input
                id="overrideStack"
                placeholder="React, TypeScript, PostgreSQL"
                {...register('overrideStack')}
                aria-invalid={errors.overrideStack?.message ? 'true' : undefined}
                className="w-full"
              />
            </Field>
          </div>

          {error ? <FormNotice variant="error">{error}</FormNotice> : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Starting...' : 'Start interview'}
            </Button>
            <Button variant="outline" asChild>
              <a href={backHref}>Back to sessions</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
