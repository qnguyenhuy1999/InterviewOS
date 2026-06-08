type DefinitionListProps = {
  items: Array<{ label: string; value: string }>
}

function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl className="space-y-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-3 border-b border-border/60 pb-2.5 last:border-b-0 last:pb-0"
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { DefinitionList }
