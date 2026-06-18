import { RefreshCcwIcon, SparklesIcon, ZapIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { TagList } from '../../../molecules/TagList/TagList'
import { resumePageFixture } from '../ResumePage.fixtures'
import type { ResumePageProps } from '../ResumePage.types'
import { AnalysisRow } from './AnalysisRow'
import { CurrentResumeRow } from './CurrentResumeRow'
import { ResumeHighlights } from './ResumeHighlights'
import { StringListSection } from './StringListSection'
import { TopicRow } from './TopicRow'
import { UploadPrompt } from './UploadPrompt'

function ResumeBody({
  data = resumePageFixture,
  renderUploadArea,
}: Pick<ResumePageProps, 'data' | 'renderUploadArea'>) {
  return (
    <div className="space-y-6">
      <ResumeHighlights data={data} />

      {renderUploadArea ?? <UploadPrompt data={data} />}

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-base font-semibold">{data.currentResume.title}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{data.currentResume.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs">
                {data.currentResume.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            <div className="space-y-2.5">
              {data.currentResume.items.map((item) => (
                <CurrentResumeRow key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-base font-semibold">{data.analysis.title}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{data.analysis.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs">
                <RefreshCcwIcon className="size-3" />
                {data.analysis.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y py-0">
            {data.analysis.items.map((item) => (
              <AnalysisRow key={item.label} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <StringListSection
          title={data.strengths.title}
          subtitle={data.strengths.subtitle}
          items={data.strengths.items}
          variant="strength"
        />
        <StringListSection
          title={data.gaps.title}
          subtitle={data.gaps.subtitle}
          items={data.gaps.items}
          variant="gap"
        />
        <StringListSection
          title={data.improvements.title}
          subtitle={data.improvements.subtitle}
          items={data.improvements.items}
          variant="improvement"
        />

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/40">
                <SparklesIcon className="size-3.5 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {data.extractedSkills.title}
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.extractedSkills.subtitle}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            {data.extractedSkills.items.length > 0 ? (
              <TagList items={data.extractedSkills.items} badgeClassName="px-3 py-1 text-xs" />
            ) : (
              <p className="text-xs text-muted-foreground">
                No skills extracted from this analysis yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0 xl:col-span-2">
          <CardHeader className="border-b py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/40">
                <ZapIcon className="size-3.5 text-sky-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {data.suggestedTopics.title}
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.suggestedTopics.subtitle}
                </p>
              </div>
            </div>
            <CardAction>
              <Button variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs">
                <SparklesIcon className="size-3" />
                {data.suggestedTopics.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            {data.suggestedTopics.items.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {data.suggestedTopics.items.map((item) => (
                  <TopicRow key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No tailored practice topics available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {(data.missingKeywords || data.bulletRewriteSuggestions || data.interviewPreparation) && (
        <div className="grid gap-5 xl:grid-cols-2">
          {data.missingKeywords && (
            <StringListSection
              title={data.missingKeywords.title}
              subtitle={data.missingKeywords.subtitle}
              items={data.missingKeywords.items}
            />
          )}
          {data.bulletRewriteSuggestions && (
            <StringListSection
              title={data.bulletRewriteSuggestions.title}
              subtitle={data.bulletRewriteSuggestions.subtitle}
              items={data.bulletRewriteSuggestions.items}
            />
          )}
          {data.interviewPreparation && (
            <StringListSection
              title={data.interviewPreparation.title}
              subtitle={data.interviewPreparation.subtitle}
              items={data.interviewPreparation.items}
            />
          )}
        </div>
      )}
    </div>
  )
}

export { ResumeBody }
