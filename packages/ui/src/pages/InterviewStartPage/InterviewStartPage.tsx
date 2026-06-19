import { PageBody, PageHeader } from '../../../components/ui/page'
import { ErrorBody } from './components/ErrorBody'
import { ReadyBody } from './components/ReadyBody'
import {
  INTERVIEW_START_PAGE_DEFAULT_DESCRIPTION,
  INTERVIEW_START_PAGE_DEFAULT_TITLE,
} from './InterviewStartPage.constants'
import type { InterviewStartPageProps } from './InterviewStartPage.types'

function Root({
  title = INTERVIEW_START_PAGE_DEFAULT_TITLE,
  description = INTERVIEW_START_PAGE_DEFAULT_DESCRIPTION,
  modeLabel,
  children,
  backHref,
  errorMessage,
}: InterviewStartPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        {errorMessage ? (
          <ErrorBody message={errorMessage} backHref={backHref} />
        ) : (
          <ReadyBody modeLabel={modeLabel} children={children} />
        )}
      </PageBody>
    </>
  )
}

const InterviewStartPage = Root

export default InterviewStartPage
