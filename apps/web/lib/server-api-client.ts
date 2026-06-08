import 'server-only'

import type { ApiErrorResponse } from '@interviewos/types'
import { headers } from 'next/headers'

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
}

export async function serverApiClient<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const requestHeaders = await headers()
  const cookie = requestHeaders.get('cookie')

  const response = await fetch(`${baseUrl()}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
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

async function createApiError(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const payload = (await response.json()) as Partial<ApiErrorResponse>
    const message = normalizeApiErrorMessage(payload.message)

    return new Error(message || `API request failed with status ${response.status}`, {
      cause: payload,
    })
  }

  const message = await response.text()
  return new Error(message || `API request failed with status ${response.status}`)
}

function normalizeApiErrorMessage(message: ApiErrorResponse['message'] | undefined) {
  if (typeof message === 'string') {
    return message
  }

  if (Array.isArray(message)) {
    return message.join(', ')
  }

  if (message && typeof message === 'object') {
    return JSON.stringify(message)
  }

  return null
}
