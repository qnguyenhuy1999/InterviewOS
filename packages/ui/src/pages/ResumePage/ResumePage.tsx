import { PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { FileUploadDropzone } from '../../organisms/FileUploadDropzone/FileUploadDropzone'
import { AnalysisRow } from './components/AnalysisRow'
import { CurrentResumeRow } from './components/CurrentResumeRow'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ResumeBody } from './components/ResumeBody'
import { TopicRow } from './components/TopicRow'
import { resumePageFixture } from './ResumePage.fixtures'
import type { ResumePageProps } from './ResumePage.types'

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  data = resumePageFixture,
  loading,
  empty,
  error,
  retryHref,
  renderUploadArea,
  uploadAction,
  emptyAction,
}: ResumePageProps) {
  return (
    <>
      <PageHeader title={data.title} description={data.subtitle} />
      <PageBody>
        {error ? (
          <ErrorBody message={error} retryHref={retryHref} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody data={data} emptyAction={emptyAction} />
        ) : (
          <ResumeBody data={data} renderUploadArea={renderUploadArea} uploadAction={uploadAction} />
        )}
      </PageBody>
      <Separator className="mt-8 opacity-0" />
    </>
  )
}

const ResumePage = Object.assign(Root, {
  AnalysisRow,
  CurrentResumeRow,
  TopicRow,
  UploadPanel: FileUploadDropzone,
})

export default ResumePage
