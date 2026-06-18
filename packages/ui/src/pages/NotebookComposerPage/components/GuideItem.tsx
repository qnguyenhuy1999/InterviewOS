import type React from 'react'

function GuideItem({
  icon: Icon,
  title,
  description,
  isLast,
}: {
  icon: React.ElementType
  title: string
  description: string
  isLast: boolean
}) {
  return (
    <div className="group flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary ring-1 ring-primary/20 transition-colors duration-150 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/60">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        {!isLast && <div className="mt-1.5 w-px grow bg-linear-to-b from-border to-transparent" />}
      </div>

      <div className={`space-y-0.5 ${isLast ? 'pb-0' : 'pb-5'}`}>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export { GuideItem }
