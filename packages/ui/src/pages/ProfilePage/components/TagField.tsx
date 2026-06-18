import { TagList } from '../../../molecules/TagList/TagList'

type TagFieldProps = {
  label: string
  items: string[]
  inputPlaceholder: string
}

export function TagField({ label, items, inputPlaceholder }: TagFieldProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2">
        <TagList
          items={items}
          trailing={<span className="text-xs text-muted-foreground">{inputPlaceholder}</span>}
        />
      </div>
    </div>
  )
}
