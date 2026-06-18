import type { SettingsFieldView } from '@interviewos/types'

import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { Switch } from '../../../../components/ui/switch'
import { getSettingsActionVariant } from '../SettingsPage.utils'

function FieldControl({ field }: { field: SettingsFieldView }) {
  if (field.kind === 'input') {
    return (
      <Input
        value={field.value}
        onChange={() => {}}
        type={field.inputType}
        className="h-10 rounded-lg bg-card px-4 shadow-xs"
      />
    )
  }

  if (field.kind === 'select') {
    return (
      <Select value={field.value} onValueChange={() => {}}>
        <SelectTrigger className="h-10 w-full rounded-lg bg-card px-4 text-left shadow-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (field.kind === 'toggle') {
    return <Switch checked={field.checked} onCheckedChange={() => {}} />
  }

  if (field.kind === 'value') {
    return (
      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{field.value}</p>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {field.actions.map((action) => (
        <Button key={action.id} variant={getSettingsActionVariant(action.intent)} size="sm">
          {action.label}
        </Button>
      ))}
    </div>
  )
}

export { FieldControl }
