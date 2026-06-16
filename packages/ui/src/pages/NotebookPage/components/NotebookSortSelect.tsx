'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { NOTEBOOK_SORT_OPTIONS, SORT_LABELS } from '../NotebookPage.constants'
import type { NotebookPageSort } from '../NotebookPage.types'

export function NotebookSortSelect({
  value,
  onValueChange,
}: {
  value?: NotebookPageSort
  onValueChange?: (value: NotebookPageSort) => void
}) {
  return (
    <Select
      value={value ?? 'updated-desc'}
      onValueChange={(next) => onValueChange?.(next as NotebookPageSort)}
    >
      <SelectTrigger className="w-full min-w-44 bg-card md:w-48">
        <SelectValue placeholder="Sort notes" />
      </SelectTrigger>
      <SelectContent>
        {NOTEBOOK_SORT_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {SORT_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
