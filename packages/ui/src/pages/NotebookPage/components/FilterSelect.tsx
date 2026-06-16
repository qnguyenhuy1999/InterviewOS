import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import type { NotebookPageFilterValue } from '../NotebookPage.types'

export function FilterSelect<T extends string>({
  value,
  options,
  placeholder,
  getLabel,
  onValueChange,
}: {
  value: NotebookPageFilterValue<T> | string | undefined
  options: readonly NotebookPageFilterValue<T>[]
  placeholder: string
  getLabel: (value: T) => string
  onValueChange?: (value: NotebookPageFilterValue<T>) => void
}) {
  return (
    <Select
      value={value ?? 'ALL'}
      onValueChange={(next) => onValueChange?.(next as NotebookPageFilterValue<T>)}
    >
      <SelectTrigger className="w-full min-w-40 bg-card md:w-44">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option === 'ALL' ? placeholder : getLabel(option as T)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
