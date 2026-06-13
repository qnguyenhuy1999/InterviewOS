import { useState } from 'react'
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react'

// TODO: Replace <textarea> with Monaco Editor when @monaco-editor/react is installed.
// Integration point: `import Editor from '@monaco-editor/react'` and swap the <textarea>.

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Java'] as const
type Language = (typeof LANGUAGES)[number]

interface Example {
  input: string
  output: string
}

export interface Problem {
  title: string
  description: string
  constraints?: string
  examples?: Example[]
}

export interface TestResult {
  name: string
  status: 'pass' | 'fail'
  input?: string
  expected?: string
  got?: string
}

export interface CodeEditorProps {
  problem: Problem
  language: Language
  value: string
  onChange: (value: string) => void
  testResults?: TestResult[]
  onRunTests?: () => void
  onReset?: () => void
}

const MONO: React.CSSProperties = {
  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
}

export function CodeEditor({
  problem,
  language: initialLanguage,
  value,
  onChange,
  testResults,
  onRunTests,
  onReset,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  const lineCount = value.split('\n').length
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  function handleReset() {
    if (window.confirm('Reset code to initial state?')) {
      onReset?.()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-surface-raised)',
        borderRadius: 'var(--radius-interview-lg)',
        border: '1px solid var(--color-border-interview)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderBottom: '1px solid var(--color-border-interview)',
          background: 'var(--color-surface-overlay)',
          flexShrink: 0,
        }}
      >
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            background: 'var(--color-surface-inset)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-interview)',
            borderRadius: 'var(--radius-interview-sm)',
            padding: '4px 8px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <div style={{ flex: 1 }} />

        <button
          type="button"
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: '1px solid var(--color-border-interview)',
            borderRadius: 'var(--radius-interview-sm)',
            color: 'var(--color-text-secondary)',
            padding: '4px 10px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={13} />
          Reset
        </button>

        <button
          type="button"
          onClick={onRunTests}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--color-accent-teal-dim)',
            border: '1px solid var(--color-accent-teal)',
            borderRadius: 'var(--radius-interview-sm)',
            color: 'var(--color-accent-teal)',
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Play size={13} />
          Run Tests
        </button>
      </div>

      {/* Split pane */}
      <PanelGroup orientation="horizontal" style={{ flex: 1, overflow: 'hidden' }}>
        <Panel defaultSize={40} minSize={25}>
          <div
            style={{
              height: '100%',
              overflow: 'auto',
              padding: 16,
              color: 'var(--color-text-primary)',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>{problem.title}</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 12, marginTop: 0 }}>
              {problem.description}
            </p>

            {problem.constraints && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 600, marginBottom: 4, marginTop: 0, fontSize: 13 }}>
                  Constraints
                </p>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 13,
                    marginTop: 0,
                    ...MONO,
                  }}
                >
                  {problem.constraints}
                </p>
              </div>
            )}

            {problem.examples?.map((ex, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  background: 'var(--color-surface-inset)',
                  borderRadius: 'var(--radius-interview-md)',
                  padding: 10,
                  fontSize: 13,
                  ...MONO,
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Input: </span>
                  {ex.input}
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Output: </span>
                  {ex.output}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <PanelResizeHandle
          style={{
            width: 4,
            background: 'var(--color-border-interview)',
            cursor: 'col-resize',
            flexShrink: 0,
          }}
        />

        <Panel minSize={30}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              aria-label="Code editor"
              style={{
                flex: 1,
                resize: 'none',
                background: 'var(--color-surface-inset)',
                color: 'var(--color-text-primary)',
                border: 'none',
                outline: 'none',
                padding: 16,
                fontSize: 13,
                lineHeight: 1.7,
                ...MONO,
              }}
            />

            {testResults && testResults.length > 0 && (
              <div
                style={{
                  maxHeight: 200,
                  overflow: 'auto',
                  borderTop: '1px solid var(--color-border-interview)',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  background: 'var(--color-surface-raised)',
                }}
              >
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}
                  >
                    {result.status === 'pass' ? (
                      <CheckCircle
                        size={14}
                        style={{ color: 'var(--color-status-live)', flexShrink: 0, marginTop: 1 }}
                      />
                    ) : (
                      <XCircle
                        size={14}
                        style={{ color: 'var(--color-status-error)', flexShrink: 0, marginTop: 1 }}
                      />
                    )}
                    <div>
                      <span
                        style={{
                          color:
                            result.status === 'pass'
                              ? 'var(--color-status-live)'
                              : 'var(--color-status-error)',
                          fontWeight: 500,
                        }}
                      >
                        {result.name}
                      </span>
                      {result.status === 'fail' && result.expected && (
                        <div
                          style={{
                            color: 'var(--color-text-muted)',
                            marginTop: 2,
                            ...MONO,
                          }}
                        >
                          expected: {result.expected} · got: {result.got}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>

      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '3px 12px',
          borderTop: '1px solid var(--color-border-interview)',
          background: 'var(--color-surface-overlay)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          flexShrink: 0,
        }}
      >
        <span>Ln {lineCount}</span>
        <span>Words {wordCount}</span>
      </div>
    </div>
  )
}
