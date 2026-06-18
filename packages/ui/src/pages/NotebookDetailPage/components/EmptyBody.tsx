import { BookOpenTextIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-96 rounded-xl"
      icon={BookOpenTextIcon}
      title="No note selected"
      description="Choose a notebook entry to open the learning article, practice questions, and study context."
      action={<Button className="rounded-lg px-4">Back to notebook</Button>}
    />
  )
}

export { EmptyBody }
