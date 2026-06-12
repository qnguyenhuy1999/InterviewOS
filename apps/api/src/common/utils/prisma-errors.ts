import { NotFoundException } from '@nestjs/common'

function isPrismaNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  )
}

export async function handlePrismaWrite<T>(
  promise: Promise<T>,
  notFoundMessage = 'Resource not found.',
): Promise<T> {
  try {
    return await promise
  } catch (error) {
    if (isPrismaNotFound(error)) {
      throw new NotFoundException(notFoundMessage)
    }
    throw error
  }
}
