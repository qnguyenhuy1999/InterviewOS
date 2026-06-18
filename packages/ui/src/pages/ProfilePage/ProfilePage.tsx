'use client'

import { PageBody, PageHeader } from '../../../components/ui/page'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { Field } from './components/Field'
import { InsightList } from './components/InsightList'
import { LoadingBody } from './components/LoadingBody'
import { ReadyBody } from './components/ReadyBody'
import { ResumeInsightCard } from './components/ResumeInsightCard'
import { ResumeUploadCard } from './components/ResumeUploadCard'
import { SelectField } from './components/SelectField'
import { TagField } from './components/TagField'
import { profileFixture } from './ProfilePage.fixtures'
import type { ProfilePageProps } from './ProfilePage.types'

function Root({ loading, empty, error, profile = profileFixture }: ProfilePageProps) {
  return (
    <>
      <PageHeader title={profile.title} description={profile.subtitle} />

      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody />
        ) : (
          <ReadyBody profile={profile} />
        )}
      </PageBody>
    </>
  )
}

const ProfilePage = Object.assign(Root, {
  Field,
  InsightList,
  ResumeInsightCard,
  ResumeUploadCard,
  SelectField,
  TagField,
})

export default ProfilePage
