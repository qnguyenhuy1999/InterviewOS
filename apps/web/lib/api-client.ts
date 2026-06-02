export async function apiClient<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      // Scaffold boundary: attach auth token here in a later phase.
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<TResponse>
}
