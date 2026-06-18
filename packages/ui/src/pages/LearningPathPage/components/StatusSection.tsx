import { Button } from '../../../../components/ui/button'
import { SectionCard } from '../../../../components/ui/page'
import { LearningPathListItem } from '../../../molecules/LearningPathListItem/LearningPathListItem'
import type { LearningPathPageProps } from '../LearningPathPage.types'
import {
  formatLearningPathLabel,
  getLearningPathEstimatedTimeLabel,
  getLearningPathStatusClassName,
} from '../LearningPathPage.utils'

type StatusSectionProps = {
  group: ReturnType<typeof import('../LearningPathPage.utils').getLearningPathStatusGroups>[number]
  renderItemActions?: LearningPathPageProps['renderItemActions']
}

export function StatusSection({ group, renderItemActions }: StatusSectionProps) {
  return (
    <SectionCard
      title={group.label}
      description={`${group.items.length} items in this stage`}
    >
      <div className="space-y-3">
        {group.items.map((item) => (
          <LearningPathListItem
            key={item.id}
            badges={[
              {
                label: formatLearningPathLabel(item.type),
                variant: 'secondary',
                className: 'rounded-full px-3 py-1',
              },
              {
                label: formatLearningPathLabel(item.status),
                variant: 'outline',
                className: getLearningPathStatusClassName(item.status),
              },
            ]}
            title={item.title}
            description={item.reason}
            priorityValue={item.priorityScore}
            footer={`Estimated time: ${getLearningPathEstimatedTimeLabel(item)}`}
            action={
              renderItemActions ? (
                renderItemActions(item)
              ) : (
                <Button variant="outline" size="sm">
                  Open task
                </Button>
              )
            }
          />
        ))}
      </div>
    </SectionCard>
  )
}
