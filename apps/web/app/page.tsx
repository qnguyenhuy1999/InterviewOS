import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-heading text-4xl font-bold">InterviewOS</h1>
      <p className="text-muted-foreground text-lg">
        Interview preparation for software engineers
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-primary px-6 py-2 text-primary-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-border px-6 py-2"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}
