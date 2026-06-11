'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type RequestPasswordResetInput,
  requestPasswordResetSchema,
} from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice } from '../../lib/form-ui'

export interface ForgotPasswordFormProps {
  onSubmit: (data: RequestPasswordResetInput) => Promise<void>
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  })

  async function handleFormSubmit(values: RequestPasswordResetInput) {
    setError(null)
    setSubmitted(false)

    try {
      await onSubmit(values)
      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to request a password reset.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          aria-invalid={errors.email?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
      {submitted ? (
        <FormNotice>
          If an account exists for that email, a reset link has been sent.
        </FormNotice>
      ) : null}
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending link...' : 'Send reset link'}
      </Button>
    </form>
  )
}
