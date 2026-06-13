export const DEFAULT_LABELS: [string, string, string, string, string] = [
  'Strong No Hire',
  'No Hire',
  'Neutral',
  'Hire',
  'Strong Hire',
]

export function getScoreColor(value: 1 | 2 | 3 | 4 | 5): string {
  return `var(--color-score-${value})`
}

export function getScoreBackgroundColor(value: 1 | 2 | 3 | 4 | 5): string {
  return `color-mix(in oklch, var(--color-score-${value}) 20%, transparent)`
}
