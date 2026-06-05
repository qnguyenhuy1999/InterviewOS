import type { NoteStatus } from '../../fixtures'

export const statusVariant: Record<NoteStatus, 'default' | 'secondary' | 'outline'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  ARCHIVED: 'outline',
}
