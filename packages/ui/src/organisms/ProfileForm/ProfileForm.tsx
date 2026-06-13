'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  EnglishLevel,
  ExperienceLevel,
  type UpsertUserLearningProfileInput,
  type UserLearningProfile,
} from '@interviewos/types'
import { parseCommaSeparated } from '@interviewos/utils'
import { type ProfileUpdateInput, profileUpdateSchema } from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice, FormSelectField } from '../../lib/form-ui'

const experienceLevels = Object.values(ExperienceLevel)
const englishLevels = Object.values(EnglishLevel)

interface ProfileFormProps {
  initialProfile: UserLearningProfile | null
  mode: 'onboarding' | 'settings'
  onSubmit: (payload: UpsertUserLearningProfileInput) => Promise<void>
}

export function ProfileForm({ initialProfile, mode, onSubmit }: ProfileFormProps) {
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

  async function handleFormSubmit(values: ProfileUpdateInput) {
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
      await onSubmit(payload)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to save profile.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
      <Field label="Target role" htmlFor="targetRole" error={errors.targetRole?.message}>
        <Input
          id="targetRole"
          {...register('targetRole')}
          aria-invalid={errors.targetRole?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <FormSelectField
          label="Current level"
          name="currentLevel"
          options={experienceLevels}
          register={register('currentLevel')}
          error={errors.currentLevel?.message}
        />
        <FormSelectField
          label="Target level"
          name="targetLevel"
          options={experienceLevels}
          register={register('targetLevel')}
          error={errors.targetLevel?.message}
        />
      </div>

      <FormSelectField
        label="English level"
        name="englishLevel"
        options={englishLevels}
        register={register('englishLevel')}
        error={errors.englishLevel?.message}
      />

      <Field label="Tech stack" htmlFor="techStack" error={errors.techStack?.message}>
        <Input
          id="techStack"
          placeholder="TypeScript, React, NestJS"
          {...register('techStack')}
          aria-invalid={errors.techStack?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
      <Field
        label="Interview goals"
        htmlFor="interviewGoals"
        error={errors.interviewGoals?.message}
      >
        <Input
          id="interviewGoals"
          placeholder="System design, confidence, senior interviews"
          {...register('interviewGoals')}
          aria-invalid={errors.interviewGoals?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
      <Field
        label="Preferred output style"
        htmlFor="preferredOutputStyle"
        error={errors.preferredOutputStyle?.message}
      >
        <Input
          id="preferredOutputStyle"
          placeholder="Concise and practical"
          {...register('preferredOutputStyle')}
          aria-invalid={errors.preferredOutputStyle?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>

      {error ? <FormNotice variant="error">{error}</FormNotice> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? 'Saving...'
          : mode === 'onboarding'
            ? 'Complete onboarding'
            : 'Save settings'}
      </Button>
    </form>
  )
}
