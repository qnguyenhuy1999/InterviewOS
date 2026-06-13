import type { Meta } from '@storybook/react-vite'

import { ReviewLayout } from './ReviewLayout'

const meta: Meta = {
  title: 'Layouts/ReviewLayout',
  component: ReviewLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta

const TopBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>
      Review
    </span>
    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
      Alex Kim · System Design · Jun 13
    </span>
  </div>
)

const VideoPanel = () => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: '#666',
      fontSize: 13,
      fontFamily: 'monospace',
    }}
  >
    ▶ video player
  </div>
)

const TranscriptPanel = () => (
  <div style={{ padding: 16 }}>
    <p
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      Transcript
    </p>
    {[
      {
        speaker: 'Interviewer',
        time: '0:12',
        text: "Can you walk me through how you'd design a URL shortener?",
      },
      {
        speaker: 'Candidate',
        time: '0:28',
        text: "Sure. I'd start by clarifying requirements — load, latency targets, availability needs.",
      },
      {
        speaker: 'Interviewer',
        time: '1:05',
        text: "Good. Let's say 100M URLs per day. How does that change your approach?",
      },
      {
        speaker: 'Candidate',
        time: '1:18',
        text: "At that scale we'd need distributed ID generation, sharded storage, and a CDN for redirects.",
      },
    ].map((line, i) => (
      <div key={i} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-accent-teal)' }}>
            {line.speaker}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{line.time}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.5, margin: 0 }}>
          {line.text}
        </p>
      </div>
    ))}
  </div>
)

const SidePanel = () => (
  <div style={{ padding: 16 }}>
    <p
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      Quick actions
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {['Add bookmark', 'Flag moment', 'Share clip'].map((action) => (
        <button
          key={action}
          type="button"
          style={{
            padding: '7px 12px',
            borderRadius: 6,
            textAlign: 'left',
            border: '1px solid var(--color-border-interview)',
            background: 'transparent',
            fontSize: 13,
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
          }}
        >
          {action}
        </button>
      ))}
    </div>
  </div>
)

export const Default = {
  render: () => (
    <ReviewLayout
      topBar={<TopBar />}
      videoPanel={<VideoPanel />}
      transcriptPanel={<TranscriptPanel />}
      sidePanel={<SidePanel />}
    />
  ),
}

export const WideTranscript = {
  render: () => (
    <ReviewLayout
      topBar={<TopBar />}
      videoPanel={<VideoPanel />}
      transcriptPanel={<TranscriptPanel />}
      sidePanel={<SidePanel />}
      defaultTranscriptWidth={440}
    />
  ),
}
