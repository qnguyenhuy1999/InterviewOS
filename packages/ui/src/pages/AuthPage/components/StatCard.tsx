function StatCard({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-4 py-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-heading text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs leading-4 text-muted-foreground">{detail}</p>
    </div>
  )
}

export { StatCard }
