'use client'

import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    try {
      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email: String(formData.get('email') ?? ''),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to request a password reset.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      action={(formData) => {
        void handleSubmit(formData)
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      {submitted ? (
        <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          If an account exists for that email, a reset link has been sent.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? 'Sending link...' : 'Send reset link'}
      </button>
    </form>
  )
}
