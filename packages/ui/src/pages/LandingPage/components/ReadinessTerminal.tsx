import { cn } from '../../../../lib/utils'

const SUB_SCORES = [
  { label: 'Algorithms', score: '91%', good: true },
  { label: 'System Design', score: '67%', good: false },
  { label: 'Behavioral', score: '88%', good: true },
] as const

function ReadinessTerminal() {
  return (
    <>
      <style>{`
        @keyframes landingBarFill {
          from { width: 0% }
          to   { width: 82% }
        }
        @keyframes landingCursor {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0 }
        }
        .landing-terminal-bar {
          animation: landingBarFill 1.8s 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .landing-terminal-cursor {
          animation: landingCursor 1.1s step-end infinite;
        }
      `}</style>

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-elevated">
        {/* Top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        {/* Title bar */}
        <div className="flex items-center gap-1.5 border-b border-border/50 bg-muted/20 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-warning/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
          <span className="ml-auto font-mono text-xs tracking-tight text-muted-foreground">
            interview-os — analyze
          </span>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5 font-mono text-xs">
          {/* Prompt */}
          <div className="text-muted-foreground/70">
            <span className="text-primary/80">$</span> interview-os analyze --session latest
          </div>

          {/* Scan output */}
          <div className="space-y-1.5">
            {['Loaded 847 practice signals', 'Resume context synced', 'Gap analysis complete'].map(
              (line) => (
                <div key={line} className="flex items-center gap-2 text-foreground/70">
                  <span className="text-success">✓</span>
                  <span>{line}</span>
                </div>
              ),
            )}
          </div>

          {/* Readiness card */}
          <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Overall readiness
              </span>
              <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                82%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="landing-terminal-bar h-full rounded-full bg-linear-to-r from-primary to-accent-strong" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-0.5">
              {SUB_SCORES.map(({ label, score, good }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p
                    className={cn('text-xs font-semibold', good ? 'text-success' : 'text-warning')}
                  >
                    {score}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Next action */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground/70">
              <span className="text-primary/80">→</span>
              <span>Next: System Design deep-dive queued</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground/50">
              <span>$</span>
              <span className="landing-terminal-cursor">▋</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { ReadinessTerminal }
