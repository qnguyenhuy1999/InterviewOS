import * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'

import type { QuestionCardProps } from './QuestionCard.types'
import { difficultyVariant } from './QuestionCard.constants'

export default function Root({ question, answer, loading }: QuestionCardProps) {
  if (loading) {
    return (
      <Card className="w-96">
        <CardHeader>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardDescription className="text-xs">Question {question.order}</CardDescription>
          <Badge variant={difficultyVariant[question.difficulty]}>{question.difficulty}</Badge>
        </div>
        <CardTitle className="text-sm leading-relaxed font-medium">{question.question}</CardTitle>
      </CardHeader>
      {answer && (
        <>
          <Separator />
          <CardContent className="pt-4 flex flex-col gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
              <p className="text-sm text-foreground/80 line-clamp-4">{answer.transcript}</p>
            </div>
            {answer.score !== null && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-medium">{answer.score}/100</span>
                </div>
                <Progress value={answer.score} className="h-1.5" />
              </div>
            )}
            {answer.feedback && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Feedback</p>
                <p className="text-sm text-muted-foreground">{answer.feedback}</p>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  )
}

const QuestionCard = Object.assign(Root, {})

export default QuestionCard
