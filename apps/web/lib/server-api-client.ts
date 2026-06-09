import 'server-only'

import { headers } from 'next/headers'

import { createApiError } from './api-error'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'interviewos_session'

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is required but not configured')
  }
  return url
}

export async function serverApiClient<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const requestHeaders = await headers()
  const allCookies = requestHeaders.get('cookie')
  const sessionCookie = allCookies
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`))

  const response = await fetch(`${baseUrl()}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(sessionCookie ? { cookie: sessionCookie } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}
