import { SparklesIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'
import { NoteSection } from '../../../organisms/NoteSection/NoteSection'

function StructuredContentEmpty() {
  return (
    <NoteSection
      id="summary"
      title="Quick summary"
      description="Generate structure first to turn this raw note into a guided study article."
      tone="muted"
    >
      <EmptyState
        className="border-dashed min-h-72 bg-background"
        icon={SparklesIcon}
        title="No structured content yet"
        description="This note is still a draft. Generate the AI structure to unlock article sections, interview answer, and practice prompts."
        action={<Button>Generate structure</Button>}
      />
    </NoteSection>
  )
}

export { StructuredContentEmpty }
