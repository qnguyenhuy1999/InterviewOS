import type * as React from 'react'

import { cn } from '../../lib/utils'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty'

type PageHeaderProps = Omit<React.ComponentProps<'header'>, 'title'> & {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        'flex flex-col gap-2.5 bg-background px-4 pt-3 md:flex-row md:items-end md:justify-between md:px-6 md:pt-4',
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <div
          data-slot="page-title"
          className="font-heading text-lg font-semibold tracking-tight md:text-xl"
        >
          {title}
        </div>
        {description ? (
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground md:text-sm">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div data-slot="page-header-actions" className="flex flex-wrap items-center gap-1.5">
          {actions}
        </div>
      ) : null}
    </header>
  )
}

function PageBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-body"
      className={cn('flex-1 px-4 py-4 md:px-6 md:py-6', className)}
      {...props}
    />
  )
}

type EmptyStateProps = Omit<React.ComponentProps<typeof Empty>, 'title'> & {
  icon?: React.ComponentType<{ className?: string }>
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Empty className={cn('rounded-xl border bg-card/40 px-5 py-10', className)} {...props}>
      <EmptyHeader>
        {Icon ? (
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
        ) : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}

type SectionCardProps = Omit<React.ComponentProps<typeof Card>, 'title'> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function SectionCard({
  title,
  description,
  action,
  children,
  className,
  ...props
}: SectionCardProps) {
  return (
    <Card className={cn('gap-0 py-0', className)} {...props}>
      {title || description || action ? (
        <CardHeader className="border-b py-2.5">
          <div className="min-w-0">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription className="text-xs">{description}</CardDescription>
            ) : null}
          </div>
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className="p-3.5">{children}</CardContent>
    </Card>
  )
}

type StatCardProps = React.ComponentProps<typeof Card> & {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

function StatCard({ label, value, hint, icon: Icon, className, ...props }: StatCardProps) {
  return (
    <Card className={className} size="sm" {...props}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardDescription className="text-xs">{label}</CardDescription>
          {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  )
}

export { EmptyState, PageBody, PageHeader, SectionCard, StatCard }
