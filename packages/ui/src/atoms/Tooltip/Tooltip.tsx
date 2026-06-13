import clsx from 'clsx'
import { useRef, useState } from 'react'

import type { TooltipPlacement, TooltipProps } from './Tooltip.types'

function getPositionStyle(placement: TooltipPlacement): React.CSSProperties {
  switch (placement) {
    case 'top':
      return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }
    case 'bottom':
      return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 }
    case 'left':
      return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 }
    case 'right':
      return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 }
  }
}

function getArrowStyle(placement: TooltipPlacement): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
  }
  switch (placement) {
    case 'top':
      return {
        ...base,
        bottom: -4,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderTop: '4px solid var(--color-surface-overlay)',
      }
    case 'bottom':
      return {
        ...base,
        top: -4,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderBottom: '4px solid var(--color-surface-overlay)',
      }
    case 'left':
      return {
        ...base,
        right: -4,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderLeft: '4px solid var(--color-surface-overlay)',
      }
    case 'right':
      return {
        ...base,
        left: -4,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderRight: '4px solid var(--color-surface-overlay)',
      }
  }
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  shortcut,
  delay = 400,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show() {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }

  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={clsx(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded border px-2 py-1 text-xs',
            className,
          )}
          style={{
            ...getPositionStyle(placement),
            backgroundColor: 'var(--color-surface-overlay)',
            borderColor: 'var(--color-border-interview)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {content}
            {shortcut && (
              <span
                className="rounded px-1 py-0.5 text-xs"
                style={{
                  fontFamily: 'var(--font-mono-interview)',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border-interview)',
                }}
              >
                {shortcut}
              </span>
            )}
          </span>
          <span style={getArrowStyle(placement)} />
        </span>
      )}
    </span>
  )
}
