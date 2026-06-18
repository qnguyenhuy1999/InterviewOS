import { SparklesIcon, TargetIcon, TrendingUpIcon } from 'lucide-react'

import type { ResumePageProps } from '../ResumePage.types'
import { resumePageFixture } from '../ResumePage.fixtures'

const STAT_ICONS = [TargetIcon, SparklesIcon, TrendingUpIcon]

function ResumeHighlights({ data = resumePageFixture }: { data?: ResumePageProps['data'] }) {
  const matchValue =
    data.analysis.items.find((item) => item.label.toLowerCase().includes('match'))?.value ?? 'N/A'

  const summaryItems = [
    {
      label: 'Job match',
      value: matchValue,
      hint: 'Based on your latest uploaded resume.',
      icon: STAT_ICONS[0],
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
    },
    {
      label: 'Skills found',
      value: data.extractedSkills.items.length,
      hint: 'Extracted from your experience.',
      icon: STAT_ICONS[1],
      accent: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      border: 'border-violet-200/60 dark:border-violet-800/40',
    },
    {
      label: 'Practice topics',
      value: data.suggestedTopics.items.length,
      hint: 'Ready to turn into interview drills.',
      icon: STAT_ICONS[2],
      accent: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200/60 dark:border-sky-800/40',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {summaryItems.map(({ label, value, hint, icon: Icon, accent, bg, border }) => (
        <div
          key={label}
          className={`relative overflow-hidden rounded-xl border ${border} ${bg} px-5 py-4 transition-shadow hover:shadow-md`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <p className={`mt-1.5 font-heading text-3xl font-bold tracking-tight ${accent}`}>
                {value}
              </p>
            </div>
            <div className={`rounded-lg p-2 ${bg} border ${border}`}>
              <Icon className={`size-4 ${accent}`} />
            </div>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>
        </div>
      ))}
    </div>
  )
}

export { ResumeHighlights }
