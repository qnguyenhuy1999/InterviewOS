export default function InterviewSessionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Interview Session</h2>
        <p className="text-sm text-muted-foreground">Session feedback</p>
      </div>

      <div className="grid gap-6">
        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">
            Technical Feedback
          </h3>
          <p className="text-sm text-muted-foreground">
            Technical evaluation and suggestions will appear here after the
            session.
          </p>
        </section>

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">
            English Feedback
          </h3>
          <p className="text-sm text-muted-foreground">
            Language and communication feedback will appear here.
          </p>
        </section>

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">
            Next Question
          </h3>
          <p className="text-sm text-muted-foreground">
            The next recommended question will appear here.
          </p>
        </section>

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">
            Recommendations
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalized recommendations will appear here.
          </p>
        </section>
      </div>
    </div>
  )
}
