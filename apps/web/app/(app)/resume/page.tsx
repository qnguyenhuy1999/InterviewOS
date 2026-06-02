export default function ResumePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Upload Resume</h2>
        <p className="text-sm text-muted-foreground">
          Upload your resume to receive AI-powered analysis and improvement
          suggestions.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border p-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p className="text-sm text-muted-foreground">
          Drag & drop or click to upload
        </p>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Select file
        </button>
      </div>
    </div>
  )
}
