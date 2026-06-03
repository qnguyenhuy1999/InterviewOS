import 'server-only'

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
    const message = await response.text()
    throw new Error(message || `API request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}
