'use client'

import type LearningPathPage from '@interviewos/ui/pages/LearningPathPage'
import LearningPathPageUI from '@interviewos/ui/pages/LearningPathPage'
import type React from 'react'

import { LearningPathActions } from '@/app/_components/forms/LearningPathActions'

type Props = Omit<React.ComponentProps<typeof LearningPathPage>, 'renderItemActions'>

export default function LearningPathPageClient(props: Props) {
  return (
    <LearningPathPageUI
      {...props}
      renderItemActions={(item) => <LearningPathActions itemId={item.id} />}
    />
  )
}
