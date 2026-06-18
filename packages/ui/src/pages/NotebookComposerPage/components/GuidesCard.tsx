import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { NOTEBOOK_COMPOSER_PAGE_GUIDES } from '../NotebookComposerPage.constants'
import { GuideItem } from './GuideItem'

function GuidesCard() {
  return (
    <Card className="gap-0 border-border/70 py-0 shadow-elevated">
      <CardHeader className="border-b py-4">
        <CardTitle className="font-heading text-base font-semibold tracking-tight">
          What makes a strong note
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-5">
        {NOTEBOOK_COMPOSER_PAGE_GUIDES.map(({ icon, title, description }, i) => (
          <GuideItem
            key={title}
            icon={icon}
            title={title}
            description={description}
            isLast={i === NOTEBOOK_COMPOSER_PAGE_GUIDES.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export { GuidesCard }
