import { FilterIcon } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import type { InterviewPageSession } from '../InterviewPage.types'
import { getInterviewTopicOptions } from '../InterviewPage.utils'

function TopicFilter({
  sessions,
  selectedTopic,
  onTopicChange,
}: {
  sessions: InterviewPageSession[]
  selectedTopic: string
  onTopicChange?: (topic: string) => void
}) {
  const topicOptions = getInterviewTopicOptions(sessions)

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        <FilterIcon className="size-4" />
      </div>
      <Select value={selectedTopic} onValueChange={onTopicChange}>
        <SelectTrigger className="h-11 min-w-56 rounded-xl bg-card px-4 text-left">
          <SelectValue placeholder="All topics" />
        </SelectTrigger>
        <SelectContent>
          {topicOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { TopicFilter }
