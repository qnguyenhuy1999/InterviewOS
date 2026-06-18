function MentalModelCard({ content }: { content: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-accent-soft px-5 py-5 shadow-elevated md:px-6">
      <p className="text-base leading-8 text-foreground">{content}</p>
    </div>
  )
}

export { MentalModelCard }
