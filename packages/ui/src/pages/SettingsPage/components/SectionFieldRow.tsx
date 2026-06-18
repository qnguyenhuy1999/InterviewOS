import type { SettingsFieldView } from '@interviewos/types'

import { cn } from '../../../../lib/utils'
import { FieldLabel } from '../../../atoms/FieldLabel/FieldLabel'
import { FieldControl } from './FieldControl'

function SectionFieldRow({ field }: { field: SettingsFieldView }) {
  const isToggle = field.kind === 'toggle'
  const isValue = field.kind === 'value'
  const isActions = field.kind === 'actions'

  return (
    <div
      className={cn(
        'grid gap-4 py-5 md:grid-cols-3 md:gap-6',
        (isValue || isActions) && 'md:items-center',
      )}
    >
      <FieldLabel label={field.label} description={field.description} />
      <div
        className={cn(
          'min-w-0',
          !isToggle && !isActions && 'md:col-span-2',
          isToggle && 'flex items-center',
          isActions && 'justify-self-start',
        )}
      >
        <FieldControl field={field} />
      </div>
    </div>
  )
}

export { SectionFieldRow }
