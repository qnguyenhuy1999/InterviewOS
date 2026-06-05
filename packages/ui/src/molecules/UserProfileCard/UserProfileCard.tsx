import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import UserProfileCardActions from './UserProfileCard.client'
import { levelVariant } from './UserProfileCard.constants'
import type { UserProfileCardProps } from './UserProfileCard.types'
import { getInitials } from './UserProfileCard.utils'

function Root({ user, profile, loading, onEdit }: UserProfileCardProps) {
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
                <Badge variant={levelVariant[profile.currentLevel]}>{profile.currentLevel}</Badge>
              </div>
              <span className="text-muted-foreground mt-4">→</span>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Level</p>
                <Badge variant={levelVariant[profile.targetLevel]}>{profile.targetLevel}</Badge>
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
      <UserProfileCardActions onEdit={onEdit} />
    </Card>
  )
}

const UserProfileCard = Object.assign(Root, {})

export default UserProfileCard
