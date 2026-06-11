'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  EnglishLevel,
  ExperienceLevel,
  type InterviewSession,
  type UserLearningProfile,
} from '@interviewos/types'
import { parseCommaSeparated } from '@interviewos/utils'
import {
  type InterviewAnswerFormInput,
  interviewAnswerFormSchema,
} from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Field } from '../../atoms/Field/Field'
import { FormNotice, FormSelectField } from '../../lib/form-ui'

const experienceLevels = Object.values(ExperienceLevel)
const englishLevels = Object.values(EnglishLevel)

type InterviewAnswerPayload = {
  answer: string
  advancedSettings?: {
    targetRole: string
    targetLevel: ExperienceLevel
    englishLevel: EnglishLevel
    techStack: string[]
    interviewGoals: string[]
    preferredOutputStyle: string
  }
}

type InterviewAnswerFormSession = Pick<
  InterviewSession,
  | 'overrideRole'
  | 'overrideLevel'
  | 'overrideStack'
  | 'overrideGoals'
  | 'overrideEnglishLevel'
  | 'preferredOutputStyle'
>

interface InterviewAnswerFormProps {
  session: InterviewAnswerFormSession
  profile: UserLearningProfile
  onSubmit: (payload: InterviewAnswerPayload) => Promise<void>
}

export function InterviewAnswerForm({ session, profile, onSubmit }: InterviewAnswerFormProps) {
  const [error, setError] = useState<string | null>(null)
  const hasOverrides = Boolean(
    session.overrideRole ||
      session.overrideLevel ||
      session.overrideEnglishLevel ||
      session.overrideStack.length ||
      session.overrideGoals.length ||
      session.preferredOutputStyle,
  )
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InterviewAnswerFormInput>({
    resolver: zodResolver(interviewAnswerFormSchema),
    defaultValues: {
      answer: '',
      advancedEnabled: hasOverrides,
      targetRole: session.overrideRole ?? profile.targetRole,
      targetLevel: session.overrideLevel ?? profile.targetLevel,
      englishLevel: session.overrideEnglishLevel ?? profile.englishLevel,
      techStack: (session.overrideStack.length ? session.overrideStack : profile.techStack).join(', '),
      interviewGoals: (session.overrideGoals.length
        ? session.overrideGoals
        : profile.interviewGoals).join(', '),
      preferredOutputStyle: session.preferredOutputStyle ?? profile.preferredOutputStyle,
    },
  })
  const advancedEnabled = watch('advancedEnabled')

  async function handleFormSubmit(values: InterviewAnswerFormInput) {
    setError(null)

    const payload: InterviewAnswerPayload = {
      answer: values.answer,
      advancedSettings: values.advancedEnabled
        ? {
            targetRole: values.targetRole,
            targetLevel: values.targetLevel,
            englishLevel: values.englishLevel,
            techStack: parseCommaSeparated(values.techStack),
            interviewGoals: parseCommaSeparated(values.interviewGoals),
            preferredOutputStyle: values.preferredOutputStyle,
          }
        : undefined,
    }

    try {
      await onSubmit(payload)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to submit answer.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <Field
        label="Your answer"
        htmlFor="answer"
        error={errors.answer?.message}
        description="Focus on structure, tradeoffs, and one concrete example."
      >
        <Textarea
          id="answer"
          rows={10}
          placeholder="Write your interview answer in English."
          {...register('answer')}
          aria-invalid={errors.answer?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-sm">Advanced session settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" {...register('advancedEnabled')} />
            Override onboarding defaults for this session
          </label>

          {advancedEnabled ? (
            <div className="grid gap-4">
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
                  label="Target level"
                  name="targetLevel"
                  options={experienceLevels}
                  register={register('targetLevel')}
                  error={errors.targetLevel?.message}
                />
                <FormSelectField
                  label="English level"
                  name="englishLevel"
                  options={englishLevels}
                  register={register('englishLevel')}
                  error={errors.englishLevel?.message}
                />
              </div>

              <Field label="Tech stack" htmlFor="techStack" error={errors.techStack?.message}>
                <Input
                  id="techStack"
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
                  {...register('preferredOutputStyle')}
                  aria-invalid={errors.preferredOutputStyle?.message ? 'true' : undefined}
                  className="w-full"
                />
              </Field>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Evaluating answer...' : 'Submit answer'}
      </Button>
    </form>
  )
}
