import {
  AlertCircleIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { TagList } from '../../../molecules/TagList/TagList'

function StringListSection({
  title,
  subtitle,
  items,
  variant = 'default',
}: {
  title: string
  subtitle: string
  items: string[]
  variant?: 'default' | 'strength' | 'gap' | 'improvement'
}) {
  if (items.length === 0) return null

  const variantConfig = {
    default: { icon: null, iconBg: '', iconColor: '' },
    strength: {
      icon: CheckCircle2Icon,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-500',
    },
    gap: {
      icon: AlertCircleIcon,
      iconBg: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-500',
    },
    improvement: {
      icon: TrendingUpIcon,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-500',
    },
  }

  const { icon: Icon, iconBg, iconColor } = variantConfig[variant]

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`flex size-7 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className={`size-3.5 ${iconColor}`} />
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <TagList items={items} badgeClassName="px-3 py-1 text-xs" />
      </CardContent>
    </Card>
  )
}

export { StringListSection }
