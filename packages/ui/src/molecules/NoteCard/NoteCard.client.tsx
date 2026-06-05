'use client'

import { Button } from '../../../components/ui/button'
import { CardFooter } from '../../../components/ui/card'

type ActionsProps = {
  onEdit?: () => void
  onDelete?: () => void
}

export default function NoteCardActions({ onEdit, onDelete }: ActionsProps) {
  return (
    <CardFooter className="gap-2 border-t pt-3">
      {onEdit && (
        <Button size="xs" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      )}
      {onDelete && (
        <Button size="xs" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      )}
    </CardFooter>
  )
}
