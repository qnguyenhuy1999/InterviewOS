/**
 * InterviewSessionCard — composite card for displaying an InterviewSession summary.
 * Composed from shadcn Card + Badge + Progress.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClockIcon, PlayIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Progress } from '../../../components/ui/progress'
import { Skeleton } from '../../../components/ui/skeleton'
import { interviewSessionFixtures, InterviewType } from '../../fixtures'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InterviewSession {
  id: string
  userId: string
  interviewType: InterviewType
  startedAt: Date
  endedAt: Date | null
}

// ---------------------------------------------------------------------------
// Type → badge variant
// ---------------------------------------------------------------------------
const typeVariant: Record<InterviewType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [InterviewType.TECHNICAL]: 'default',
  [InterviewType.BEHAVIORAL]: 'secondary',
  [InterviewType.SYSTEM_DESIGN]: 'outline',
  [InterviewType.MIXED]: 'destructive',
}

interface InterviewCardProps {
  session: InterviewSession
  questionsAnswered?: number
  totalQuestions?: number
  averageScore?: number
  loading?: boolean
  onResume?: () => void
  onReview?: () => void
}

function InterviewCard({
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
          <Badge variant={typeVariant[session.interviewType as InterviewType]}>
            {session.interviewType}
          </Badge>
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
      {(onResume || onReview) && (
        <CardFooter className="gap-2 border-t pt-3">
          {onResume && !isCompleted && (
            <Button size="xs" onClick={onResume}>
              <PlayIcon /> Resume
            </Button>
          )}
          {onReview && isCompleted && (
            <Button size="xs" variant="outline" onClick={onReview}>
              Review
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta = {
  title: 'Molecules/InterviewSessionCard',
  component: InterviewCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof InterviewCard>

export default meta
type Story = StoryObj<typeof meta>

export const Completed: Story = {
  args: {
    session: interviewSessionFixtures.technical,
    questionsAnswered: 3,
    totalQuestions: 3,
    averageScore: 79,
    onReview: () => {},
  },
}

export const InProgress: Story = {
  args: {
    session: interviewSessionFixtures.inProgress,
    questionsAnswered: 1,
    totalQuestions: 3,
    onResume: () => {},
  },
}

export const Fresh: Story = {
  args: {
    session: interviewSessionFixtures.inProgress,
    questionsAnswered: 0,
    totalQuestions: 3,
    onResume: () => {},
  },
}

export const Loading: Story = {
  args: {
    session: interviewSessionFixtures.technical,
    loading: true,
  },
}

export const AllTypes: Story = {
  args: { session: interviewSessionFixtures.technical },
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.values(InterviewType).map((type) => (
        <InterviewCard
          key={type}
          session={{
            id: `session-${type}`,
            userId: 'user-001',
            interviewType: type,
            startedAt: new Date('2025-06-01'),
            endedAt: new Date('2025-06-01'),
          }}
          questionsAnswered={2}
          totalQuestions={3}
          averageScore={75}
        />
      ))}
    </div>
  ),
}
