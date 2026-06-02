import type { CSSProperties } from 'react'

export const uiTheme = {
  colors: {
    background: '#0f172a',
    surface: '#111827',
    surfaceElevated: '#1e293b',
    border: 'rgba(148, 163, 184, 0.18)',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#60a5fa',
    accentStrong: '#2563eb',
    accentSoft: '#dbeafe',
    success: '#22c55e',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },
  shadow: '0 24px 64px rgba(15, 23, 42, 0.28)',
} as const

export const shellStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '40px 24px',
  background:
    'radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 34%), linear-gradient(180deg, #020617 0%, #0f172a 100%)',
  color: uiTheme.colors.text,
  boxSizing: 'border-box',
}

export const frameStyle: CSSProperties = {
  maxWidth: '1120px',
  margin: '0 auto',
  display: 'grid',
  gap: '24px',
}

export const surfaceStyle: CSSProperties = {
  border: `1px solid ${uiTheme.colors.border}`,
  borderRadius: uiTheme.radius.xl,
  background: `linear-gradient(180deg, ${uiTheme.colors.surface} 0%, #0b1220 100%)`,
  boxShadow: uiTheme.shadow,
}
