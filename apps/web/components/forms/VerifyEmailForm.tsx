'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function VerifyEmailForm({ token }: { token?: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function confirmEmailVerification(formData: FormData) {
    setPending(true)
    setError(null)
    setMessage(null)

    try {
      const response = await apiFetch('/auth/email-verification/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: token ?? String(formData.get('token') ?? ''),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setMessage('Email verified successfully.')
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to verify email.',
      )
    } finally {
      setPending(false)
    }
  }

  async function resendVerification(formData: FormData) {
    setPending(true)
    setError(null)
    setMessage(null)

    try {
      const response = await apiFetch('/auth/email-verification/resend', {
        method: 'POST',
        body: JSON.stringify({
          email: String(formData.get('email') ?? ''),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setMessage('Verification email sent if the account is eligible.')
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to resend verification email.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <form
        action={(formData) => {
          void confirmEmailVerification(formData)
        }}
        className="space-y-4"
      >
        {!token ? (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="token">
              Verification token
            </label>
            <input
              id="token"
              name="token"
              type="text"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {pending ? 'Verifying...' : 'Verify email'}
        </button>
      </form>

      <div className="border-t border-border pt-6">
        <form
          action={(formData) => {
            void resendVerification(formData)
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Resend verification email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg border border-border py-2 text-sm font-medium disabled:opacity-60"
          >
            {pending ? 'Sending...' : 'Resend email'}
          </button>
        </form>
      </div>

      {message ? (
        <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  )
}
