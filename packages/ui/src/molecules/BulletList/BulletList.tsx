import { cn } from '../../../lib/utils'

type BulletListProps = {
  items: string[]
  className?: string
}

function BulletList({ items, className }: BulletListProps) {
  return (
    <ul className={cn('space-y-1.5', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-foreground">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/80" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export { BulletList }
