'use client'

import type { ResumeAnalysis } from '@interviewos/types'
import { useRouter } from 'next/navigation'
import { type FormEvent, useRef, useState } from 'react'

import { apiFetch } from '@/lib/api-client'
import { formatDate } from '@/lib/format'

type ResumeUploadFormProps = {
  initialAnalysis: ResumeAnalysis | null
}

export function ResumeUploadForm({ initialAnalysis }: ResumeUploadFormProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const file = inputRef.current?.files?.[0]

    if (!file) {
      setError('Select a PDF, DOCX, or TXT file to continue.')
      return
    }

    setPending(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.set('file', file)

      const response = await apiFetch('/resume/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const nextAnalysis = (await response.json()) as ResumeAnalysis
      setAnalysis(nextAnalysis)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to analyze your resume.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-medium">Resume analysis</h2>
          <p className="text-sm text-muted-foreground">
            Upload a PDF, DOCX, or TXT file up to 5 MB for AI feedback against your target profile.
          </p>
        </div>

        <label className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border p-8 text-center">
          <input
            ref={inputRef}
            type="file"
            name="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="sr-only"
          />
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
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {analysis ? 'Replace your existing analysis' : 'Upload your resume'}
            </p>
            <p className="text-sm text-muted-foreground">
              Click to choose a file. Supported formats: PDF, DOCX, TXT.
            </p>
          </div>
        </label>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {pending ? 'Analyzing...' : analysis ? 'Re-upload and analyze' : 'Upload and analyze'}
        </button>
      </form>

      {analysis ? <ResumeAnalysisCard analysis={analysis} /> : null}
    </div>
  )
}

function ResumeAnalysisCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-medium">Latest analysis</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {analysis.targetRole} / {analysis.targetLevel.replaceAll('_', ' ')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {analysis.fileName ?? 'Uploaded resume'} / {formatDate(analysis.analyzedAt)}
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-3 text-center text-primary">
          <p className="text-xs uppercase tracking-wide">Score</p>
          <p className="font-heading text-3xl font-medium">{analysis.score}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Strengths" items={analysis.strengths} />
        <ListCard title="Gaps" items={analysis.gaps} />
        <ListCard title="Recommendations" items={analysis.recommendations} />
        <ListCard title="Skills detected" items={analysis.keySkillsFound} />
      </div>
    </section>
  )
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border px-4 py-4">
      <h4 className="text-sm font-medium">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-primary">*</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
