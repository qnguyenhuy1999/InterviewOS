type DefinitionListProps = {
  items: Array<{ label: string; value: string }>
}

function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { DefinitionList }
