import { cn } from '../../../lib/utils'

export type NoteTocItem = {
  id: string
  label: string
}

type NoteTocProps = {
  items: NoteTocItem[]
  activeId?: string
  onNavigate?: (id: string) => void
  className?: string
}

function NoteToc({ items, activeId, onNavigate, className }: NoteTocProps) {
  return (
    <nav aria-label="On this page" className={cn('space-y-1.5', className)}>
      {items.map((item) => {
        const isActive = item.id === activeId

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate?.(item.id)}
            aria-current={isActive ? 'location' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
              isActive
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                isActive ? 'bg-background' : 'bg-muted-foreground/40',
              )}
            />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export { NoteToc }
