import { type ApiErrorResponse } from '@interviewos/types'

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
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
