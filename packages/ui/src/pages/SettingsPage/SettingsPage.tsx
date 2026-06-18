'use client'

import { PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { SettingsSectionNav } from '../../organisms/SettingsSectionNav/SettingsSectionNav'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { SectionCard } from './components/SectionCard'
import { SettingsBody } from './components/SettingsBody'
import { settingsPageFixture } from './SettingsPage.fixtures'
import type { SettingsPageProps } from './SettingsPage.types'

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  data = settingsPageFixture,
  activeSectionId = 'profile',
  loading,
  empty,
  error,
  onSectionChange,
}: SettingsPageProps) {
  return (
    <>
      <PageHeader title={data.title} description={data.subtitle} />

      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty || data.sections.length === 0 ? (
          <EmptyBody />
        ) : (
          <SettingsBody
            data={data}
            activeSectionId={activeSectionId}
            onSectionChange={onSectionChange}
          />
        )}
      </PageBody>

      <Separator className="mt-8 opacity-0" />
    </>
  )
}

const SettingsPage = Object.assign(Root, {
  SectionCard,
  SectionNav: SettingsSectionNav,
})

export default SettingsPage
