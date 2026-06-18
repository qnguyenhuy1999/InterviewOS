'use client'

import { PageBody } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { MetricCard } from './components/MetricCard'
import { ReadyBody } from './components/ReadyBody'
import type { DashboardPageProps } from './DashboardPage.types'

function Root({ state, actions }: DashboardPageProps) {
  return (
    <PageBody>
      {state.kind === 'loading' ? (
        <LoadingBody />
      ) : state.kind === 'error' ? (
        <ErrorBody message={state.message} retryHref={actions.retryHref} />
      ) : state.kind === 'empty' ? (
        <EmptyBody actions={actions} />
      ) : (
        <ReadyBody state={state} actions={actions} />
      )}
      <Separator className="mt-8 opacity-0" />
    </PageBody>
  )
}

const DashboardPage = Object.assign(Root, { MetricCard })
export default DashboardPage
