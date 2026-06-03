function baseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${baseUrl()}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
}

export function absoluteApiPath(path: string): string {
  return `${baseUrl()}${path}`
}
