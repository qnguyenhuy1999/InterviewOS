import type { ResumeAnalysisAttribute } from '../ResumePage.types'

function AnalysisRow({ item }: { item: ResumeAnalysisAttribute }) {
  return (
    <div className="group flex items-center justify-between gap-4 py-3 text-sm">
      <span className="text-muted-foreground transition-colors group-hover:text-foreground/80">
        {item.label}
      </span>
      <span className="font-semibold tabular-nums text-foreground">{item.value}</span>
    </div>
  )
}

export { AnalysisRow }
