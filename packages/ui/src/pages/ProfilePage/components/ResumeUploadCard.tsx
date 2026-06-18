import { FileUploadDropzone } from '../../../organisms/FileUploadDropzone/FileUploadDropzone'

type ResumeUploadCardProps = {
  title: string
  description: string
  ctaLabel: string
}

export function ResumeUploadCard({ title, description, ctaLabel }: ResumeUploadCardProps) {
  return (
    <FileUploadDropzone
      title={title}
      description={description}
      actionLabel={ctaLabel}
      className="border-dashed bg-muted py-0"
      contentClassName="flex min-h-72 flex-col items-center justify-center gap-4 p-5 text-center"
    />
  )
}
