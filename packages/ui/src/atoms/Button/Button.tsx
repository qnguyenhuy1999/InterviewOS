import type { ButtonHTMLAttributes, CSSProperties } from 'react'

import { uiTheme } from '../../theme'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  primary?: boolean
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label: string
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, CSSProperties> = {
  small: {
    fontSize: '0.875rem',
    padding: '0.625rem 0.875rem',
  },
  medium: {
    fontSize: '0.9375rem',
    padding: '0.8rem 1.1rem',
  },
  large: {
    fontSize: '1rem',
    padding: '0.95rem 1.35rem',
  },
}

const baseStyle: CSSProperties = {
  border: 'none',
  borderRadius: uiTheme.radius.md,
  fontWeight: 700,
  lineHeight: 1,
  cursor: 'pointer',
  transition: 'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
}

const primaryStyle: CSSProperties = {
  color: '#eff6ff',
  background: `linear-gradient(135deg, ${uiTheme.colors.accentStrong} 0%, ${uiTheme.colors.accent} 100%)`,
  boxShadow: '0 12px 24px rgba(37, 99, 235, 0.25)',
}

const secondaryStyle: CSSProperties = {
  color: uiTheme.colors.text,
  background: uiTheme.colors.surfaceElevated,
  boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.12)',
}

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  style,
  ...props
}: ButtonProps) => {
  const resolvedStyle: CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...(primary ? primaryStyle : secondaryStyle),
    ...(backgroundColor ? { backgroundColor } : {}),
    ...style,
  }

  return (
    <button type="button" style={resolvedStyle} {...props}>
      {label}
    </button>
  )
}
