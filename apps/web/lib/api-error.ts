import type { ApiErrorResponse } from '@interviewos/types'

export class ApiHttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    cause?: unknown,
  ) {
    super(message)
    this.name = 'ApiHttpError'
    if (cause !== undefined) this.cause = cause
  }
}

export async function createApiError(response: Response): Promise<ApiHttpError> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const payload = (await response.json()) as Partial<ApiErrorResponse>
    const message = normalizeApiErrorMessage(payload.message)
    return new ApiHttpError(
      message || `API request failed with status ${response.status}`,
      response.status,
      payload,
    )
  }

  const message = await response.text()
  return new ApiHttpError(
    message || `API request failed with status ${response.status}`,
    response.status,
  )
}

export function normalizeApiErrorMessage(
  message: ApiErrorResponse['message'] | undefined,
): string | null {
  if (typeof message === 'string') return message
  if (Array.isArray(message)) return message.join(', ')
  if (message && typeof message === 'object') return JSON.stringify(message)
  return null
}
