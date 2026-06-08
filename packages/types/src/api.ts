export interface ApiErrorResponse {
  statusCode: number
  error: string
  message: string | string[] | Record<string, unknown>
  path: string
  timestamp: string
  details?: Array<{
    path: string[]
    message: string
  }>
}
