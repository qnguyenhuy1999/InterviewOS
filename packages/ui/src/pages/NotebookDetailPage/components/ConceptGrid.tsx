function ConceptGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <div key={item} className="rounded-xl border border-border/70 bg-muted px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Concept {index + 1}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">{item}</p>
        </div>
      ))}
    </div>
  )
}

export { ConceptGrid }
