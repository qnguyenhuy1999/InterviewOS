'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { RegisterInput } from '@interviewos/validators'
import { registerSchema } from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Field } from '../../atoms/Field/Field'
import { FormNotice } from '../../lib/form-ui'

export interface RegisterFormProps {
  onSubmit: (values: RegisterInput) => Promise<void>
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function handleFormSubmit(values: RegisterInput) {
    setError(null)
    try {
      await onSubmit(values)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to create account.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          {...register('name')}
          aria-invalid={errors.name?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
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
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          {...register('password')}
          aria-invalid={errors.password?.message ? 'true' : undefined}
          className="w-full"
        />
      </Field>
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
