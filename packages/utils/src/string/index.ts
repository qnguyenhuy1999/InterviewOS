const MAX_PROMPT_CHARS = 8_000

export function wrapUserInput(value: string): string {
  return `<user_input>${value}</user_input>`
}

export function truncatePromptContent(content: unknown, maxChars = MAX_PROMPT_CHARS): string {
  const serialized = JSON.stringify(content)
  return serialized.length <= maxChars
    ? serialized
    : serialized.slice(0, maxChars) + '...[truncated]'
}

export function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export function truncate(value: string, maxLength: number, suffix = '...'): string {
  if (value.length <= maxLength) return value
  return value.slice(0, maxLength - suffix.length) + suffix
}
