import { SparklesIcon } from 'lucide-react'

import { Card, CardContent } from '../../../../components/ui/card'
import { Separator } from '../../../../components/ui/separator'

function DownstreamCard() {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-accent-soft py-0 shadow-elevated">
      <SparklesIcon
        className="pointer-events-none absolute -right-3 -bottom-3 size-24 rotate-12 text-primary/10"
        aria-hidden="true"
      />
      <CardContent className="relative space-y-2 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Downstream use
        </p>
        <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Notes feed interview practice.
        </p>
        <Separator className="border-primary/15" />
        <p className="text-sm leading-6 text-muted-foreground">
          Clear concepts, examples, and pitfalls make better questions and sharper spaced repetition
          later.
        </p>
      </CardContent>
    </Card>
  )
}

export { DownstreamCard }
