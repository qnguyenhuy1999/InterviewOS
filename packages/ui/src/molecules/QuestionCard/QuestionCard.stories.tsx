/**
 * QuestionCard — composite card showing an interview question with answer feedback.
 * Composed from shadcn Card + Badge + Progress.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

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
import { answerFixtures, QuestionDifficulty, questionFixtures } from '../../fixtures'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Question {
  id: string
  sessionId: string
  question: string
  difficulty: QuestionDifficulty
  order: number
}

interface Answer {
  id: string
  questionId: string
  transcript: string
  score: number | null
  feedback: string | null
  evaluatedAt: Date | null
}

// ---------------------------------------------------------------------------
// Difficulty → badge variant
// ---------------------------------------------------------------------------
const difficultyVariant: Record<
  QuestionDifficulty,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  [QuestionDifficulty.EASY]: 'secondary',
  [QuestionDifficulty.MEDIUM]: 'outline',
  [QuestionDifficulty.HARD]: 'default',
  [QuestionDifficulty.EXPERT]: 'destructive',
}

interface QuestionCardProps {
  question: Question
  answer?: Answer
  loading?: boolean
}

function QuestionCard({ question, answer, loading }: QuestionCardProps) {
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
          <Badge variant={difficultyVariant[question.difficulty as QuestionDifficulty]}>
            {question.difficulty}
          </Badge>
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

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta = {
  title: 'Molecules/QuestionCard',
  component: QuestionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithAnswer: Story = {
  args: {
    question: questionFixtures[0],
    answer: answerFixtures[0],
  },
}

export const WithoutAnswer: Story = {
  args: {
    question: questionFixtures[1],
  },
}

export const Loading: Story = {
  args: {
    question: questionFixtures[0],
    loading: true,
  },
}

export const AllDifficulties: Story = {
  args: { question: questionFixtures[0] },
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.values(QuestionDifficulty).map((diff, i) => (
        <QuestionCard
          key={diff}
          question={{
            id: `q-${diff}`,
            sessionId: 'session-001',
            question: `Sample ${diff.toLowerCase()} question about system design and software architecture.`,
            difficulty: diff,
            order: i + 1,
          }}
        />
      ))}
    </div>
  ),
}

export const WithHighScore: Story = {
  args: {
    question: questionFixtures[0],
    answer: { ...answerFixtures[0], score: 95 },
  },
}

export const WithLowScore: Story = {
  args: {
    question: questionFixtures[0],
    answer: { ...answerFixtures[0], score: 42 },
  },
}
