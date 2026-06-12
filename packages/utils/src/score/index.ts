export function clampScore(value: number, minimum = 0, maximum = 100): number {
  return Math.min(Math.max(Math.round(value), minimum), maximum)
}

export function percentOf(value: number, total: number): number {
  if (total === 0) return 0
  return clampScore((value / total) * 100)
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}
