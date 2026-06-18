import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import type { DashboardMetric } from '../DashboardPage.types'

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card
      aria-label={`${metric.label}: ${metric.value}`}
      className="group relative overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-elevated"
      size="sm"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-primary via-accent-strong to-transparent transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden="true"
      />
      <CardHeader className="gap-1 pt-4">
        <CardDescription className="text-xs font-semibold uppercase tracking-widest">
          {metric.label}
        </CardDescription>
        <CardTitle className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
          {metric.value}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-xs leading-5 text-muted-foreground">{metric.hint}</p>
      </CardContent>
    </Card>
  )
}
