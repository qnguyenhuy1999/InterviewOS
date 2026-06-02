import type { CSSProperties } from 'react'
import React from 'react'

import { Header } from '../../molecules/Header/Header'
import { frameStyle, shellStyle, surfaceStyle, uiTheme } from '../../theme'

type User = {
  name: string
}

const contentStyle: CSSProperties = {
  ...surfaceStyle,
  padding: '32px',
  display: 'grid',
  gap: '18px',
}

const introGridStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
}

const cardStyle: CSSProperties = {
  padding: '20px',
  borderRadius: uiTheme.radius.lg,
  background: 'rgba(15, 23, 42, 0.82)',
  border: `1px solid ${uiTheme.colors.border}`,
}

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.25rem',
  display: 'grid',
  gap: '10px',
  color: uiTheme.colors.muted,
}

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>()

  return (
    <article style={shellStyle}>
      <div style={frameStyle}>
        <Header
          user={user}
          onLogin={() => setUser({ name: 'Jane Doe' })}
          onLogout={() => setUser(undefined)}
          onCreateAccount={() => setUser({ name: 'Jane Doe' })}
        />

        <section style={contentStyle}>
          <div style={introGridStyle}>
            <div style={cardStyle}>
              <p style={{ margin: 0, color: uiTheme.colors.accentSoft, fontWeight: 700 }}>
                Organism
              </p>
              <h2 style={{ margin: '8px 0 10px', fontSize: '1.5rem' }}>Pages in Storybook</h2>
              <p style={{ margin: 0, color: uiTheme.colors.muted, lineHeight: 1.7 }}>
                Build pages from atoms and molecules, then wire interactions with mock state instead
                of app navigation.
              </p>
            </div>

            <div style={cardStyle}>
              <p style={{ margin: 0, color: uiTheme.colors.accentSoft, fontWeight: 700 }}>
                Structure
              </p>
              <ul style={listStyle}>
                <li>Atoms own primitive UI pieces like buttons.</li>
                <li>Molecules compose atoms into reusable patterns.</li>
                <li>Organisms assemble page-level story states.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
