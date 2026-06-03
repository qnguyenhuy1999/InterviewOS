import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'

// Skeleton meta
const skeletonMeta = {
  title: 'Shadcn/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default skeletonMeta
type Story = StoryObj<typeof skeletonMeta>

export const Default: Story = {
  args: { className: 'h-4 w-48' },
}

export const Circle: Story = {
  args: { className: 'size-10 rounded-full' },
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border w-72">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  ),
}

export const TableSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  ),
}

export const SpinnerStory: Story = {
  name: 'Spinner',
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}

export const LoadingState: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Spinner className="size-4" />
      <span className="text-sm">Loading interview session...</span>
    </div>
  ),
}
