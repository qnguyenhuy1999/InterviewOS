import clsx from 'clsx'

import { StatusDot } from '../../atoms/StatusDot'
import { Timer } from '../../atoms/Timer'
import type { CandidateHeaderProps, CandidateHeaderStatus } from './CandidateHeader.types'

function statusToDot(status: CandidateHeaderStatus): 'live' | 'idle' | 'offline' {
  if (status === 'live') return 'live'
  if (status === 'paused') return 'idle'
  return 'offline'
}

function statusLabel(status: CandidateHeaderStatus): string {
  if (status === 'live') return 'Live'
  if (status === 'paused') return 'Paused'
  return 'Ended'
}

export function CandidateHeader({
  candidateName,
  role,
  company,
  stage,
  status,
  elapsedSeconds,
  className,
}: CandidateHeaderProps) {
  const isLive = status === 'live'

  return (
    <header
      className={clsx('relative flex items-center px-4 gap-4', className)}
      style={{
        height: 48,
        backgroundColor: 'var(--color-surface-raised)',
        borderBottom: `1px solid var(--color-border-interview)`,
        boxShadow: 'var(--shadow-interview-sm)',
      }}
    >
      {/* Signal ribbon */}
      {isLive && (
        <div
          className="animate-pulse-live absolute bottom-0 left-0 right-0"
          style={{
            height: 4,
            backgroundColor: 'var(--color-status-live)',
            borderRadius: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Left: candidate name + role */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <span
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {candidateName}
          {company && (
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
              {' '}
              @ {company}
            </span>
          )}
        </span>
        <span className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
          {role}
        </span>
      </div>

      {/* Center: status dot + stage */}
      <div className="flex items-center gap-2 shrink-0">
        <StatusDot variant={statusToDot(status)} size="sm" />
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {stage ?? statusLabel(status)}
        </span>
      </div>

      {/* Right: elapsed timer */}
      <div className="flex justify-end shrink-0" style={{ minWidth: 60 }}>
        {elapsedSeconds !== undefined && (
          <Timer variant="elapsed" seconds={elapsedSeconds} compact />
        )}
      </div>
    </header>
  )
}
