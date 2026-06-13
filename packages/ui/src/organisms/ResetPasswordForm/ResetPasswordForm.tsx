'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ResetPasswordFormInput,
  resetPasswordFormSchema,
  type ResetPasswordInput,
} from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice } from '../../lib/form-ui'

export interface ResetPasswordFormProps {
  token?: string
  onSubmit: (data: ResetPasswordInput) => Promise<void>
  onSuccess?: () => void
}

export function ResetPasswordForm({ token, onSubmit, onSuccess }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: token ?? '',
      password: '',
      confirmPassword: '',
    },
  })

  async function handleFormSubmit(values: ResetPasswordFormInput) {
    setError(null)
    setSuccess(false)

    try {
      await onSubmit({
        token: token ?? values.token,
        password: values.password,
      })

      setSuccess(true)
      onSuccess?.()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to reset password.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {!token ? (
        <Field label="Reset token" htmlFor="token" error={errors.token?.message}>
          <Input
            id="token"
            type="text"
            {...register('token')}
            aria-invalid={errors.token?.message ? 'true' : undefined}
            className="w-full"
          />
        </Field>
      ) : null}
      <Field label="New password" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
      <Field
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={errors.confirmPassword?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
      {success ? <FormNotice>Password updated. Redirecting to sign in.</FormNotice> : null}
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Updating password...' : 'Reset password'}
      </Button>
    </form>
  )
}
