export function formatDate(input: string | Date | null | undefined) {
  if (!input) {
    return 'Not available'
  }

  const date = input instanceof Date ? input : new Date(input)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function parseCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
