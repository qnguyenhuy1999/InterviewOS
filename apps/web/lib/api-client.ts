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

export function absoluteApiPath(path: string): string {
  return `${baseUrl()}${path}`
}
