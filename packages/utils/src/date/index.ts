import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return 'Not available'
  const date = input instanceof Date ? input : parseISO(String(input))
  if (!isValid(date)) return 'Invalid date'
  return format(date, 'MMM d, yyyy')
}

export function formatRelativeDate(input: string | Date | null | undefined): string {
  if (!input) return 'Not available'
  const date = input instanceof Date ? input : parseISO(String(input))
  if (!isValid(date)) return 'Invalid date'
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return 'Not available'
  const date = input instanceof Date ? input : parseISO(String(input))
  if (!isValid(date)) return 'Invalid date'
  return format(date, 'MMM d, yyyy HH:mm')
}
