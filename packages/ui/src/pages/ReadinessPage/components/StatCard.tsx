import { Progress } from '../../../../components/ui/progress'

interface StatCardProps {
  label: string
  value: string
  description: string
  progress?: number
}

function StatCard({ label, value, description, progress }: StatCardProps) {
  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-border/60 bg-background p-4 transition-colors duration-150 hover:bg-muted/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {progress !== undefined && <Progress value={progress} className="h-1.5" />}
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export { StatCard }
