import type { CSSProperties } from 'react'

import { Button } from '../../atoms/Button/Button'
import { uiTheme } from '../../theme'

type User = {
  name: string
}

export interface HeaderProps {
  user?: User
  onLogin?: () => void
  onLogout?: () => void
  onCreateAccount?: () => void
}

const shellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
  padding: '22px 24px',
  borderRadius: uiTheme.radius.xl,
  background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(30, 41, 59, 0.9) 100%)',
  border: `1px solid ${uiTheme.colors.border}`,
  boxShadow: uiTheme.shadow,
  flexWrap: 'wrap',
}

const brandStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
}

const badgeStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: 'grid',
  placeItems: 'center',
  background: `linear-gradient(135deg, ${uiTheme.colors.accentStrong} 0%, ${uiTheme.colors.accent} 100%)`,
  boxShadow: '0 18px 30px rgba(37, 99, 235, 0.22)',
  flexShrink: 0,
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const actionsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
}

const welcomeStyle: CSSProperties = {
  color: uiTheme.colors.muted,
  fontSize: '0.95rem',
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <header style={shellStyle}>
    <div style={brandStyle}>
      <div style={badgeStyle} aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6.5L11 3l7 3.5v9L11 19l-7-3.5v-9Z"
            stroke="#EFF6FF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M11 3v16M4 6.5l7 3.5 7-3.5"
            stroke="#EFF6FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h1 style={titleStyle}>InterviewOS</h1>
        <span style={{ color: uiTheme.colors.muted, fontSize: '0.9rem' }}>
          Atomic Storybook surface
        </span>
      </div>
    </div>
    <div style={actionsStyle}>
      {user ? (
        <>
          <span style={welcomeStyle}>
            Welcome, <strong style={{ color: uiTheme.colors.text }}>{user.name}</strong>
          </span>
          <Button size="small" onClick={onLogout} label="Log out" />
        </>
      ) : (
        <>
          <Button size="small" onClick={onLogin} label="Log in" />
          <Button primary size="small" onClick={onCreateAccount} label="Sign up" />
        </>
      )}
    </div>
  </header>
)
