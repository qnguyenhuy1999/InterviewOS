'use client'

import { Button } from '../../../components/ui/button'
import { CardFooter } from '../../../components/ui/card'

type ActionsProps = {
  onEdit?: () => void
}

export default function UserProfileCardActions({ onEdit }: ActionsProps) {
  if (!onEdit) return null
  return (
    <CardFooter className="border-t pt-3">
      <Button size="xs" variant="outline" onClick={onEdit} className="w-full">
        Edit Profile
      </Button>
    </CardFooter>
  )
}
