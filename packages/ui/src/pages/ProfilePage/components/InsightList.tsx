import { PROFILE_INSIGHT_HEADING_CLASS_NAME } from '../ProfilePage.constants'

type InsightListProps = {
  title: string
  items: string[]
  tone: keyof typeof PROFILE_INSIGHT_HEADING_CLASS_NAME
}

export function InsightList({ title, items, tone }: InsightListProps) {
  return (
    <div className="space-y-2">
      <p className={`text-xs font-semibold uppercase ${PROFILE_INSIGHT_HEADING_CLASS_NAME[tone]}`}>
        {title}
      </p>
      <ul className="space-y-1.5 pl-5 text-sm text-foreground">
        {items.map((item) => (
          <li key={item} className="list-disc leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
