export class AIProviderError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly retryable: boolean,
  ) {
    super(message)
    this.name = 'AIProviderError'
  }
}
