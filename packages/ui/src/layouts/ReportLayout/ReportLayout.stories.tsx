import type { Meta } from '@storybook/react-vite'

import { ReportLayout } from './ReportLayout'

const meta: Meta = {
  title: 'Layouts/ReportLayout',
  component: ReportLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta

const Header = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
        Interview Report
      </h1>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
        Alex Kim · System Design · Jun 13, 2026
      </p>
    </div>
    <button
      type="button"
      style={{
        padding: '7px 16px',
        borderRadius: 6,
        border: 'none',
        background: 'var(--color-accent-teal)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      Export PDF
    </button>
  </div>
)

const Sidebar = () => (
  <nav>
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      Sections
    </p>
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {['Overview', 'Scorecard', 'Transcript', 'AI Analysis', 'Recommendations'].map(
        (section, i) => (
          <li key={section}>
            <a
              href="#"
              style={{
                display: 'block',
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 13,
                color: i === 0 ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)',
                background: i === 0 ? 'var(--color-accent-teal-dim)' : 'transparent',
                textDecoration: 'none',
                fontWeight: i === 0 ? 500 : 400,
              }}
            >
              {section}
            </a>
          </li>
        ),
      )}
    </ul>
  </nav>
)

const Content = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    {['Overview', 'Scorecard', 'Key moments', 'AI Analysis'].map((section) => (
      <section key={section}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: '1px solid var(--color-border-interview-subtle)',
          }}
        >
          {section}
        </h2>
        <div
          style={{
            height: 120,
            borderRadius: 8,
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border-interview-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: 'var(--color-text-muted)',
          }}
        >
          {section} content
        </div>
      </section>
    ))}
  </div>
)

export const Default = {
  render: () => (
    <ReportLayout header={<Header />} sidebar={<Sidebar />}>
      <Content />
    </ReportLayout>
  ),
}
