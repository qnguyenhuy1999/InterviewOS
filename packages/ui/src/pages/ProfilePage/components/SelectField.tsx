import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import type { ProfileSelectOption } from '../ProfilePage.types'

type SelectFieldProps = {
  label: string
  value: string
  options: ProfileSelectOption[]
}

export function SelectField({ label, value, options }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Select value={value}>
        <SelectTrigger className="h-9 w-full rounded-lg px-3 text-left text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
