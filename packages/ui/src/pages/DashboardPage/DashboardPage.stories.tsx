/**
 * DashboardPage — screen-level story composing the main InterviewOS dashboard.
 * Uses shadcn primitives + fixtures. No hardcoded colors — all design tokens.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon, BrainCircuitIcon, FlameIcon, PlusIcon, TrendingUpIcon } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import {
  Empty as EmptyPlaceholder,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '../../../components/ui/empty'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  dashboardStats,
  interviewSessionFixtures,
  InterviewType,
  learningProfileFixture,
  manyNotes,
  noteFixtures,
  NoteStatus,
  NoteType,
  userFixtures,
} from '../../fixtures'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  trend?: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">{label}</CardDescription>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold">{value}</CardTitle>
      </CardHeader>
      {trend && (
        <CardContent>
          <p className="text-xs text-muted-foreground">{trend}</p>
        </CardContent>
      )}
    </Card>
  )
}

function NoteRow({
  note,
}: {
  note: { id: string; title: string; noteType: NoteType; status: NoteStatus; tags: string[] }
}) {
  const statusVariant: Record<NoteStatus, 'default' | 'secondary' | 'outline'> = {
    [NoteStatus.PUBLISHED]: 'default',
    [NoteStatus.DRAFT]: 'secondary',
    [NoteStatus.ARCHIVED]: 'outline',
  }
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <BookOpenIcon className="size-4 text-muted-foreground shrink-0" />
        <span className="text-sm truncate">{note.title}</span>
      </div>
      <Badge variant={statusVariant[note.status as NoteStatus]} className="shrink-0">
        {note.status}
      </Badge>
    </div>
  )
}

function SessionRow({
  session,
}: {
  session: {
    id: string
    interviewType: InterviewType
    startedAt: Date
    endedAt: Date | null
    score?: number
  }
}) {
  const typeVariant: Record<InterviewType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    [InterviewType.TECHNICAL]: 'default',
    [InterviewType.BEHAVIORAL]: 'secondary',
    [InterviewType.SYSTEM_DESIGN]: 'outline',
    [InterviewType.MIXED]: 'destructive',
  }
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <BrainCircuitIcon className="size-4 text-muted-foreground shrink-0" />
        <div>
          <span className="text-sm">{session.interviewType.replace('_', ' ')}</span>
          <p className="text-xs text-muted-foreground">{session.startedAt.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {session.score !== undefined && (
          <span className="text-sm font-medium">{session.score}/100</span>
        )}
        <Badge variant={typeVariant[session.interviewType as InterviewType]}>
          {session.endedAt ? 'Done' : 'In Progress'}
        </Badge>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Full Dashboard
// ---------------------------------------------------------------------------

interface DashboardPageProps {
  loading?: boolean
  empty?: boolean
  error?: string
}

function DashboardPage({ loading, empty, error }: DashboardPageProps) {
  const user = userFixtures.jane
  const profile = learningProfileFixture

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <EmptyPlaceholder className="border border-destructive/30 bg-destructive/5 max-w-sm">
          <EmptyHeader>
            <EmptyTitle className="text-destructive">Failed to load dashboard</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="destructive" size="sm">
              Retry
            </Button>
          </EmptyContent>
        </EmptyPlaceholder>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-12 mt-1" />
                </CardHeader>
              </Card>
            ))}
          </div>
          {/* Content skeleton */}
          <div className="flex items-center justify-center h-48">
            <Spinner className="size-6" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-base font-semibold">{user.name}</h1>
              <p className="text-xs text-muted-foreground">{profile.targetRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <FlameIcon className="size-3" />
              {dashboardStats.streakDays} day streak
            </Badge>
            <Button size="sm">
              <PlusIcon /> New Session
            </Button>
          </div>
        </header>

        <Separator />

        {/* Progress summary */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Level progress: {profile.currentLevel} → {profile.targetLevel}
            </span>
            <span className="font-medium">{dashboardStats.averageScore}/100 avg</span>
          </div>
          <Progress value={dashboardStats.averageScore} className="h-2" />
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Practice Sessions"
            value={dashboardStats.totalSessions}
            icon={BrainCircuitIcon}
            trend="+3 this week"
          />
          <StatCard
            label="Average Score"
            value={`${dashboardStats.averageScore}/100`}
            icon={TrendingUpIcon}
            trend="+4 from last week"
          />
          <StatCard
            label="Study Notes"
            value={dashboardStats.notesCount}
            icon={BookOpenIcon}
            trend="+2 this week"
          />
          <StatCard
            label="Day Streak"
            value={dashboardStats.streakDays}
            icon={FlameIcon}
            trend="Keep it up!"
          />
        </div>

        {/* Main content tabs */}
        {empty ? (
          <EmptyPlaceholder className="border border-border min-h-64">
            <EmptyHeader>
              <EmptyTitle>No activity yet</EmptyTitle>
              <EmptyDescription>
                Start a practice session or create a study note to see your progress.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">
                <PlusIcon /> Start Practicing
              </Button>
            </EmptyContent>
          </EmptyPlaceholder>
        ) : (
          <Tabs defaultValue="notes">
            <TabsList>
              <TabsTrigger value="notes">Recent Notes</TabsTrigger>
              <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-4 divide-y divide-border">
                  {Object.values(noteFixtures).map((note) => (
                    <NoteRow key={note.id} note={note} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sessions">
              <Card>
                <CardContent className="pt-4 divide-y divide-border">
                  <SessionRow session={{ ...interviewSessionFixtures.technical, score: 79 }} />
                  <SessionRow session={interviewSessionFixtures.inProgress} />
                  {Object.values(InterviewType)
                    .slice(2)
                    .map((type, i) => (
                      <SessionRow
                        key={type}
                        session={{
                          id: `session-extra-${i}`,
                          interviewType: type,
                          startedAt: new Date(2025, 4, 20 + i),
                          endedAt: new Date(2025, 4, 20 + i),
                          score: 70 + i * 5,
                        }}
                      />
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Topics */}
        <section>
          <h2 className="text-sm font-medium mb-3 text-muted-foreground">Topics Studied</h2>
          <div className="flex flex-wrap gap-2">
            {dashboardStats.topicsStudied.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const HappyPath: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const EmptyState: Story = {
  args: { empty: true },
}

export const Error: Story = {
  args: {
    error: 'Unable to connect to the server. Please check your connection and try again.',
  },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
}

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
}

export const LargeDataset: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <h1 className="text-lg font-bold">Large Dataset View</h1>
        <Card>
          <CardContent className="pt-4 divide-y divide-border">
            {manyNotes.map((note) => (
              <NoteRow key={note.id} note={note} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}
