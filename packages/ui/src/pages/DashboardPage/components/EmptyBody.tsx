import { CheckCircle2Icon, LanguagesIcon, MicIcon, NotebookTextIcon, SparklesIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { EmptyState } from '../../../../components/ui/page'

import { ActionItem } from './ActionItem'
import type { DashboardPageActions } from '../DashboardPage.types'

export function EmptyBody({ actions }: { actions: DashboardPageActions }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="text-lg font-semibold">Start your first loop</CardTitle>
            <CardDescription>
              Pick one action to create the first signals for this dashboard.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 py-4">
          <ActionItem
            href={actions.createNoteHref}
            label="Create note"
            icon={<NotebookTextIcon />}
            primary
          />
          <ActionItem
            href={actions.startInterviewHref}
            label="Start interview"
            icon={<MicIcon />}
          />
          <ActionItem href={actions.reviewQueueHref} label="Review queue" icon={<SparklesIcon />} />
          <ActionItem
            href={actions.englishNotesHref}
            label="English notes"
            icon={<LanguagesIcon />}
          />
        </CardContent>
      </Card>

      <EmptyState
        className="min-h-72"
        icon={CheckCircle2Icon}
        title="No activity yet"
        description="Create a note, run an interview, or open the review queue to generate your first progress signals."
        action={
          <Button asChild>
            <a href={actions.createNoteHref}>
              <NotebookTextIcon aria-hidden="true" />
              Create first note
            </a>
          </Button>
        }
      />
    </div>
  )
}
