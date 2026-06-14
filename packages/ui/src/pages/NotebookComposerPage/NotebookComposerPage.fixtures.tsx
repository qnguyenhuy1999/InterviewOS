import { Button } from '../../../components/ui/button'
import type { NotebookComposerPageProps } from './NotebookComposerPage.types'

export const notebookComposerPageFixture: NotebookComposerPageProps = {
  children: (
    <div className="space-y-3">
      <div className="h-12 rounded-xl border border-border/70 bg-muted/40" />
      <div className="h-24 rounded-xl border border-border/70 bg-muted/40" />
      <Button>Create note</Button>
    </div>
  ),
  profileStateLabel: 'Using onboarding defaults',
}
