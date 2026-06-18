import { AlertCircleIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'

function ErrorBody({ message }: { message: string }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10">
        <AlertCircleIcon className="size-6 text-destructive" />
      </div>
      <div className="max-w-sm">
        <p className="text-base font-semibold text-destructive">Failed to load resume workspace</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{message}</p>
      </div>
      <Button variant="destructive" size="sm" className="rounded-full px-6">
        Try again
      </Button>
    </div>
  )
}

export { ErrorBody }
