export type RouteState<T> =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'empty' }
  | { kind: 'ready'; data: T }

type LoadRouteDataOptions<T> = {
  isEmpty?: (data: T) => boolean
  fallbackMessage?: string
}

export async function loadRouteData<T>(
  loader: () => Promise<T>,
  options: LoadRouteDataOptions<T> = {},
): Promise<RouteState<T>> {
  try {
    const data = await loader()
    return toRouteState(data, options.isEmpty)
  } catch (error) {
    return {
      kind: 'error',
      message: getRouteErrorMessage(error, options.fallbackMessage),
    }
  }
}

export function toRouteState<T>(data: T, isEmpty?: (data: T) => boolean): RouteState<T> {
  if (isEmpty?.(data) ?? false) {
    return { kind: 'empty' }
  }

  return { kind: 'ready', data }
}

export function getRouteErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong while loading this page.',
): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallbackMessage
}
