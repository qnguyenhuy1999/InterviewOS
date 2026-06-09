'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { API_ROUTES } from '@interviewos/config'
import type { RegisterInput } from '@interviewos/validators'
import { registerSchema } from '@interviewos/validators'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { apiFetch, createApiError } from '@/lib/api-client'
import { Field } from './Field'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: RegisterInput) {
    setError(null)

    try {
      const response = await apiFetch(API_ROUTES.auth.register, {
        method: 'POST',
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw await createApiError(response)
      }

      router.push('/onboarding')
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to create account.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          {...register('name')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          {...register('password')}
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
        className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}

