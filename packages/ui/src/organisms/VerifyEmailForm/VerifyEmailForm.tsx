'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ConfirmEmailVerificationInput,
  confirmEmailVerificationSchema,
  type ResendEmailVerificationInput,
  resendEmailVerificationSchema,
} from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice } from '../../lib/form-ui'

export interface VerifyEmailFormProps {
  token?: string
  onVerify: (data: ConfirmEmailVerificationInput) => Promise<void>
  onResend: (data: ResendEmailVerificationInput) => Promise<void>
}

export function VerifyEmailForm({ token, onVerify, onResend }: VerifyEmailFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const verifyForm = useForm<ConfirmEmailVerificationInput>({
    resolver: zodResolver(confirmEmailVerificationSchema),
    defaultValues: {
      token: token ?? '',
    },
  })
  const resendForm = useForm<ResendEmailVerificationInput>({
    resolver: zodResolver(resendEmailVerificationSchema),
    defaultValues: {
      email: '',
    },
  })

  async function confirmEmailVerification(values: ConfirmEmailVerificationInput) {
    setError(null)
    setMessage(null)

    try {
      await onVerify({
        token: token ?? values.token,
      })
      setMessage('Email verified successfully.')
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to verify email.',
      )
    }
  }

  async function resendVerification(values: ResendEmailVerificationInput) {
    setError(null)
    setMessage(null)

    try {
      await onResend(values)
      setMessage('Verification email sent if the account is eligible.')
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to resend verification email.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={verifyForm.handleSubmit(confirmEmailVerification)}
        className="space-y-4"
        noValidate
      >
        {!token ? (
          <Field
            label="Verification token"
            htmlFor="token"
            error={verifyForm.formState.errors.token?.message}
          >
            <Input
              id="token"
              type="text"
              {...verifyForm.register('token')}
              aria-invalid={verifyForm.formState.errors.token?.message ? 'true' : undefined}
              className="w-full"
            />
          </Field>
        ) : null}
        <Button
          type="submit"
          disabled={verifyForm.formState.isSubmitting || resendForm.formState.isSubmitting}
          className="w-full"
        >
          {verifyForm.formState.isSubmitting ? 'Verifying...' : 'Verify email'}
        </Button>
      </form>

      <div className="border-t border-border pt-6">
        <form
          onSubmit={resendForm.handleSubmit(resendVerification)}
          className="space-y-4"
          noValidate
        >
          <Field
            label="Resend verification email"
            htmlFor="email"
            error={resendForm.formState.errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...resendForm.register('email')}
              aria-invalid={resendForm.formState.errors.email?.message ? 'true' : undefined}
              className="w-full"
            />
          </Field>
          <Button
            type="submit"
            disabled={verifyForm.formState.isSubmitting || resendForm.formState.isSubmitting}
            variant="outline"
            className="w-full"
          >
            {resendForm.formState.isSubmitting ? 'Sending...' : 'Resend email'}
          </Button>
        </form>
      </div>

      {message ? <FormNotice>{message}</FormNotice> : null}
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
    </div>
  )
}
