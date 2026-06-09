import { createApiError } from './api-error'

export { createApiError } from './api-error'

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is required but not configured')
  }
  return url
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${baseUrl()}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    ...init,
    headers,
  })
}

export async function apiFetchJson<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await apiFetch(path, init)

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

export function absoluteApiPath(path: string): string {
  return `${baseUrl()}${path}`
}
