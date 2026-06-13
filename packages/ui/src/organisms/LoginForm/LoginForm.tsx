'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type LoginInput, loginSchema } from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice } from '../../lib/form-ui'

export interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void>
  forgotPasswordHref: string
}

export function LoginForm({ onSubmit, forgotPasswordHref }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleFormSubmit(values: LoginInput) {
    setError(null)

    try {
      await onSubmit(values)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to sign in.')
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <a href={forgotPasswordHref} className="text-xs text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          aria-invalid={errors.password?.message ? 'true' : undefined}
          className="w-full"
        />
        {errors.password?.message ? (
          <FormNotice variant="error">{errors.password.message}</FormNotice>
        ) : null}
      </div>
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
