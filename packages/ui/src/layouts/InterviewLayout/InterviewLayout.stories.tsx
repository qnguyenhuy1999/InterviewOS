import type { Meta } from '@storybook/react-vite'

import { InterviewLayout } from './InterviewLayout'

const meta: Meta = {
  title: 'Layouts/InterviewLayout',
  component: InterviewLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta

const Slot = ({ label, accent }: { label: string; accent?: boolean }) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: accent ? 'var(--color-surface-base)' : 'var(--color-surface-inset)',
      fontSize: 12,
      color: 'var(--color-text-muted)',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
      padding: 16,
    }}
  >
    {label}
  </div>
)

const TopBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)' }}>
      InterviewOS
    </span>
    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>System Design · Round 1</span>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          padding: '2px 8px',
          borderRadius: 9999,
          background: 'var(--color-status-live)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        LIVE
      </span>
      <span
        style={{
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        14:32
      </span>
    </div>
  </div>
)

export const Default = {
  render: () => (
    <InterviewLayout
      topBar={<TopBar />}
      leftPanel={
        <Slot
          label="left panel&#10;questions / nav"
        />
      }
      centerPanel={
        <Slot
          label="center panel&#10;code editor / canvas"
          accent
        />
      }
      rightPanel={
        <Slot
          label="right panel&#10;notes / feedback"
        />
      }
    />
  ),
}

export const NarrowLeft = {
  render: () => (
    <InterviewLayout
      topBar={<TopBar />}
      leftPanel={<Slot label="left" />}
      centerPanel={<Slot label="center" accent />}
      rightPanel={<Slot label="right" />}
      defaultLeftWidth={200}
      defaultRightWidth={360}
    />
  ),
}

export const WideRight = {
  render: () => (
    <InterviewLayout
      topBar={<TopBar />}
      leftPanel={<Slot label="left" />}
      centerPanel={<Slot label="center" accent />}
      rightPanel={
        <Slot
          label="right panel&#10;wide scorecard"
        />
      }
      defaultLeftWidth={240}
      defaultRightWidth={440}
    />
  ),
}
