import type { Meta } from '@storybook/react-vite'

import { DebriefLayout } from './DebriefLayout'

const meta: Meta = {
  title: 'Layouts/DebriefLayout',
  component: DebriefLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta

const TopBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>
      Debrief
    </span>
    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>System Design · Alex Kim</span>
    <div style={{ marginLeft: 'auto' }}>
      <button
        type="button"
        style={{
          padding: '5px 14px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--color-accent-teal)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Submit scorecard
      </button>
    </div>
  </div>
)

const Scorecard = () => (
  <div style={{ padding: 20 }}>
    <p
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      Scorecard
    </p>
    {['Problem solving', 'Communication', 'System design', 'Code quality', 'Culture fit'].map(
      (criterion) => (
        <div key={criterion} style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              marginBottom: 6,
            }}
          >
            {criterion}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid var(--color-border-interview)',
                  background: score === 4 ? 'var(--color-accent-teal)' : 'transparent',
                  color: score === 4 ? '#fff' : 'var(--color-text-secondary)',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      ),
    )}
  </div>
)

const Notes = () => (
  <div>
    <h2
      style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}
    >
      Debrief notes
    </h2>
    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
      Capture observations from the interview session.
    </p>
    <textarea
      placeholder="Start typing your notes…"
      style={{
        width: '100%',
        minHeight: 320,
        padding: 16,
        borderRadius: 8,
        border: '1px solid var(--color-border-interview)',
        background: 'var(--color-surface-inset)',
        color: 'var(--color-text-primary)',
        fontSize: 14,
        resize: 'vertical',
        outline: 'none',
      }}
    />
  </div>
)

const Footer = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
    <button
      type="button"
      style={{
        padding: '7px 18px',
        borderRadius: 6,
        border: '1px solid var(--color-border-interview)',
        background: 'transparent',
        fontSize: 13,
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
      }}
    >
      Save draft
    </button>
    <button
      type="button"
      style={{
        padding: '7px 18px',
        borderRadius: 6,
        border: 'none',
        background: 'var(--color-accent-teal)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      Submit
    </button>
  </div>
)

export const Default = {
  render: () => (
    <DebriefLayout
      topBar={<TopBar />}
      scorecardPanel={<Scorecard />}
      notesPanel={<Notes />}
      footer={<Footer />}
    />
  ),
}

export const NoFooter = {
  render: () => (
    <DebriefLayout topBar={<TopBar />} scorecardPanel={<Scorecard />} notesPanel={<Notes />} />
  ),
}
