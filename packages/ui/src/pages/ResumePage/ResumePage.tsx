import { PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { AnalysisRow } from './components/AnalysisRow'
import { CurrentResumeRow } from './components/CurrentResumeRow'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ResumeBody } from './components/ResumeBody'
import { TopicRow } from './components/TopicRow'
import { FileUploadDropzone } from '../../organisms/FileUploadDropzone/FileUploadDropzone'
import { resumePageFixture } from './ResumePage.fixtures'
import type { ResumePageProps } from './ResumePage.types'

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  data = resumePageFixture,
  loading,
  empty,
  error,
  renderUploadArea,
  emptyAction,
}: ResumePageProps) {
  return (
    <>
      <PageHeader title={data.title} description={data.subtitle} />
      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody data={data} emptyAction={emptyAction} />
        ) : (
          <ResumeBody data={data} renderUploadArea={renderUploadArea} />
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
