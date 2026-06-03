/**
 * UserProfileCard — composite card for displaying a User's learning profile.
 * Composed from shadcn Card + Avatar + Badge.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
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
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { ExperienceLevel, learningProfileFixture, userFixtures } from '../../fixtures'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

interface LearningProfile {
  id: string
  userId: string
  targetRole: string
  currentLevel: ExperienceLevel
  targetLevel: ExperienceLevel
  techStack: string[]
  interviewGoals: string[]
  englishLevel: string
  preferredOutputStyle: string
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// ExperienceLevel → badge variant
// ---------------------------------------------------------------------------
const levelVariant: Record<ExperienceLevel, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [ExperienceLevel.JUNIOR]: 'outline',
  [ExperienceLevel.MID]: 'secondary',
  [ExperienceLevel.SENIOR]: 'default',
  [ExperienceLevel.STAFF]: 'default',
  [ExperienceLevel.PRINCIPAL]: 'default',
}

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface UserProfileCardProps {
  user: User
  profile?: LearningProfile
  loading?: boolean
  onEdit?: () => void
}

function UserProfileCard({ user, profile, loading, onEdit }: UserProfileCardProps) {
  if (loading) {
    return (
      <Card className="w-80">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mt-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{user.name ?? 'Anonymous User'}</CardTitle>
            <CardDescription className="text-xs">{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {profile && (
        <>
          <Separator />
          <CardContent className="pt-4 flex flex-col gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Target Role</p>
              <p className="text-sm font-medium">{profile.targetRole}</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Level</p>
                <Badge variant={levelVariant[profile.currentLevel as ExperienceLevel]}>
                  {profile.currentLevel}
                </Badge>
              </div>
              <span className="text-muted-foreground mt-4">→</span>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Level</p>
                <Badge variant={levelVariant[profile.targetLevel as ExperienceLevel]}>
                  {profile.targetLevel}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1">
                {profile.techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </>
      )}
      {onEdit && (
        <CardFooter className="border-t pt-3">
          <Button size="xs" variant="outline" onClick={onEdit} className="w-full">
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta = {
  title: 'Molecules/UserProfileCard',
  component: UserProfileCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof UserProfileCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithProfile: Story = {
  args: {
    user: userFixtures.jane,
    profile: learningProfileFixture,
    onEdit: () => {},
  },
}

export const NoProfile: Story = {
  args: {
    user: userFixtures.jane,
  },
}

export const AnonymousUser: Story = {
  args: {
    user: userFixtures.anonymous,
    profile: {
      ...learningProfileFixture,
      userId: userFixtures.anonymous.id,
    },
  },
}

export const Loading: Story = {
  args: {
    user: userFixtures.jane,
    loading: true,
  },
}

export const AllExperienceLevels: Story = {
  args: { user: userFixtures.jane },
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.values(ExperienceLevel).map((level) => (
        <UserProfileCard
          key={level}
          user={userFixtures.jane}
          profile={{
            ...learningProfileFixture,
            currentLevel: level,
            targetLevel: ExperienceLevel.PRINCIPAL,
          }}
        />
      ))}
    </div>
  ),
}
