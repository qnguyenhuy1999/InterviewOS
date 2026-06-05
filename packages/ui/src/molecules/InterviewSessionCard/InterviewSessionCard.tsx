import { ClockIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Progress } from '../../../components/ui/progress'
import { Skeleton } from '../../../components/ui/skeleton'
import InterviewSessionCardActions from './InterviewSessionCard.client'
import { typeVariant } from './InterviewSessionCard.constants'
import type { InterviewCardProps } from './InterviewSessionCard.types'

function Root({
  session,
  questionsAnswered = 0,
  totalQuestions = 3,
  averageScore,
  loading,
  onResume,
  onReview,
}: InterviewCardProps) {
  const isCompleted = session.endedAt !== null
  const progress = totalQuestions > 0 ? (questionsAnswered / totalQuestions) * 100 : 0

  if (loading) {
    return (
      <Card className="w-80">
        <CardHeader>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">
            {session.interviewType.replace('_', ' ')} Interview
          </CardTitle>
          <Badge variant={typeVariant[session.interviewType]}>{session.interviewType}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <ClockIcon className="size-3" />
          {session.startedAt.toLocaleDateString()}
          {isCompleted ? ' · Completed' : ' · In Progress'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {questionsAnswered}/{totalQuestions} questions
            </span>
            {averageScore !== undefined && <span>Score: {averageScore}/100</span>}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardContent>
      <InterviewSessionCardActions
        onResume={onResume}
        onReview={onReview}
        isCompleted={isCompleted}
      />
    </Card>
  )
}

const InterviewSessionCard = Object.assign(Root, {})

export default InterviewSessionCard
