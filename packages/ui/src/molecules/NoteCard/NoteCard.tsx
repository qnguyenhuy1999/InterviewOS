import { TagIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import NoteCardActions from './NoteCard.client'
import { statusVariant } from './NoteCard.constants'
import type { NoteCardProps } from './NoteCard.types'

function Root({ note, onEdit, onDelete, loading }: NoteCardProps) {
  if (loading) {
    return (
      <Card className="w-72">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mt-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-72">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{note.title}</CardTitle>
          <Badge variant={statusVariant[note.status]}>{note.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <TagIcon className="size-3" />
          {note.noteType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      {(onEdit || onDelete) && <NoteCardActions onEdit={onEdit} onDelete={onDelete} />}
    </Card>
  )
}

const NoteCard = Object.assign(Root, {})

export default NoteCard
