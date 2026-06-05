import type { CSSProperties } from 'react'

export const uiTheme = {
  colors: {
    background: 'var(--background)',
    surface: 'var(--surface)',
    surfaceElevated: 'var(--surface-elevated)',
    border: 'var(--border)',
    text: 'var(--foreground)',
    muted: 'var(--muted-foreground)',
    accent: 'var(--accent)',
    accentStrong: 'var(--accent-strong)',
    accentSoft: 'var(--accent-soft)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
  shadow: 'var(--shadow-elevated)',
} as const

export const shellStyle: CSSProperties = {
  minHeight: '100vh',
  padding: 'var(--layout-shell-padding-block) var(--layout-shell-padding-inline)',
  background:
    'radial-gradient(circle at top left, color-mix(in oklch, var(--accent) 18%, transparent) 0%, transparent 34%), linear-gradient(180deg, var(--surface-elevated) 0%, var(--background) 100%)',
  color: uiTheme.colors.text,
  boxSizing: 'border-box',
}

export const frameStyle: CSSProperties = {
  maxWidth: 'var(--layout-frame-max-width)',
  margin: '0 auto',
  display: 'grid',
  gap: 'var(--layout-frame-gap)',
}

export const surfaceStyle: CSSProperties = {
  border: `1px solid ${uiTheme.colors.border}`,
  borderRadius: uiTheme.radius.xl,
  background: `linear-gradient(180deg, ${uiTheme.colors.surface} 0%, ${uiTheme.colors.background} 100%)`,
  boxShadow: uiTheme.shadow,
}
