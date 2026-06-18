'use client'

import { RotateCcwIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { DimensionRow } from './components/DimensionRow'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { HistoryRow } from './components/HistoryRow'
import { LoadingBody } from './components/LoadingBody'
import { ReadinessBody } from './components/ReadinessBody'
import { readinessPageFixture } from './ReadinessPage.fixtures'
import type { ReadinessPageProps } from './ReadinessPage.types'

function Root({
  data = readinessPageFixture,
  loading,
  empty,
  error,
  renderRecomputeAction,
}: ReadinessPageProps) {
  return (
    <>
      <PageHeader
        title={data.title}
        description={data.subtitle}
        actions={
          renderRecomputeAction ?? (
            <Button size="lg">
              <RotateCcwIcon className="size-4" />
              {data.recomputeLabel}
            </Button>
          )
        }
      />

      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody />
        ) : (
          <ReadinessBody data={data} />
        )}
      </PageBody>

      <Separator className="opacity-0" />
    </>
  )
}

const ReadinessPage = Object.assign(Root, {
  DimensionRow,
  HistoryRow,
})

export default ReadinessPage
