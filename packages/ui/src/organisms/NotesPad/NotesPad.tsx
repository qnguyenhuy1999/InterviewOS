import clsx from 'clsx'
import * as React from 'react'

import type { NotesPadProps, SaveStatus } from './NotesPad.types'

const TAGS = ['/strength', '/concern', '/followup', '/action'] as const

function SaveIndicator({ status }: { status: SaveStatus }) {
  const label = status === 'saved' ? 'Saved' : status === 'saving' ? 'Saving...' : 'Unsaved'
  const color =
    status === 'saved'
      ? 'var(--color-status-live)'
      : status === 'saving'
        ? 'var(--color-status-warn)'
        : 'var(--color-text-muted)'

  return (
    <span className="text-xs" style={{ color }}>
      {label}
    </span>
  )
}

export function NotesPad({ initialContent = '', onChange, className }: NotesPadProps) {
  const [text, setText] = React.useState(initialContent)
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('saved')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setText(val)
    setSaveStatus('unsaved')
    autoResize()

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSaveStatus('saving')
      setTimeout(() => {
        onChange(val)
        setSaveStatus('saved')
      }, 400)
    }, 1000)
  }

  function insertTag(tag: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = text.slice(0, start) + tag + ' ' + text.slice(end)
    setText(next)
    setSaveStatus('unsaved')
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + tag.length + 1, start + tag.length + 1)
      autoResize()
    }, 0)
  }

  React.useEffect(() => {
    autoResize()
  }, [])

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div
      className={clsx('flex flex-col', className)}
      style={{
        backgroundColor: 'var(--color-surface-inset)',
        border: '1px solid var(--color-border-interview)',
        borderRadius: 'var(--radius-interview-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid var(--color-border-interview)' }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Notes
        </span>
        <SaveIndicator status={saveStatus} />
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Take notes here… use /strength /concern /followup /action to tag observations."
        rows={6}
        style={{
          fontFamily: 'var(--font-mono-interview)',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--color-text-primary)',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '12px',
          width: '100%',
          minHeight: 120,
          overflowY: 'hidden',
        }}
      />

      {/* Quick-tag buttons */}
      <div
        className="flex flex-wrap gap-1.5 px-3 py-2"
        style={{ borderTop: '1px solid var(--color-border-interview)' }}
      >
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => insertTag(tag)}
            className="text-xs px-2 py-0.5 rounded-full transition-colors"
            style={{
              fontFamily: 'var(--font-mono-interview)',
              color: 'var(--color-accent-teal)',
              backgroundColor: 'var(--color-accent-teal-glow)',
              border: '1px solid var(--color-accent-teal-dim)',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
