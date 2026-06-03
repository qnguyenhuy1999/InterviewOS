'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    try {
      const password = String(formData.get('password') ?? '')
      const confirmPassword = String(formData.get('confirmPassword') ?? '')

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.')
      }

      const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: token ?? String(formData.get('token') ?? ''),
          password,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setSuccess(true)
      router.push('/login')
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to reset password.',
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
      {!token ? (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="token">
            Reset token
          </label>
          <input
            id="token"
            name="token"
            type="text"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      ) : null}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      {success ? (
        <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          Password updated. Redirecting to sign in.
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
        {pending ? 'Updating password...' : 'Reset password'}
      </button>
    </form>
  )
}
