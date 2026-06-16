'use client'

import { useEffect, useState } from 'react'

export function ReadinessDial({ score }: { score: number }) {
  const radius = 54
  const center = 70
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * (270 / 360)
  const [filled, setFilled] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(Math.min(score, 100)))
    return () => cancelAnimationFrame(id)
  }, [score])

  const offset = arcLength - (filled / 100) * arcLength

  return (
    <div className="relative size-[140px]">
      <svg
        viewBox="0 0 140 140"
        width="140"
        height="140"
        className="overflow-visible"
        aria-label={`Readiness score: ${score}`}
        role="img"
      >
        <defs>
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent-strong)" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={8}
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(135 ${center} ${center})`}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#dialGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(135 ${center} ${center})`}
          className="transition-[stroke-dashoffset] duration-900 ease-in-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="font-mono text-[34px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
          {score}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          readiness
        </span>
      </div>
    </div>
  )
}
