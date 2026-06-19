import { Badge } from '../../../components/ui/badge'
import { PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import { DownstreamCard } from './components/DownstreamCard'
import { GuidesCard } from './components/GuidesCard'
import {
  NOTEBOOK_COMPOSER_PAGE_DEFAULT_DESCRIPTION,
  NOTEBOOK_COMPOSER_PAGE_DEFAULT_TITLE,
} from './NotebookComposerPage.constants'
import type { NotebookComposerPageProps } from './NotebookComposerPage.types'

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  title = NOTEBOOK_COMPOSER_PAGE_DEFAULT_TITLE,
  description = NOTEBOOK_COMPOSER_PAGE_DEFAULT_DESCRIPTION,
  profileStateLabel,
  children,
}: NotebookComposerPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />

      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          {/* ── Left: composer ─────────────────────────────────── */}
          <SectionCard
            title="Draft the note"
            description="Capture the content first. You can refine tags, difficulty, and interview readiness as you go."
          >
            <div className="space-y-4">
              {profileStateLabel ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
                >
                  {profileStateLabel}
                </Badge>
              ) : null}
              {children}
            </div>
          </SectionCard>

          {/* ── Right: sidebar ─────────────────────────────────── */}
          <div className="space-y-4">
            <GuidesCard />
            <DownstreamCard />
          </div>
        </div>
      </PageBody>
    </>
  )
}

const NotebookComposerPage = Root
export default NotebookComposerPage
