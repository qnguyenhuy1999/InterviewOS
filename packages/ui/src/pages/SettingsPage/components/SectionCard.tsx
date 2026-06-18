import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Separator } from '../../../../components/ui/separator'
import { cn } from '../../../../lib/utils'
import type { SettingsPageSection } from '../SettingsPage.types'
import { getSettingsActionVariant } from '../SettingsPage.utils'
import { SectionFieldRow } from './SectionFieldRow'

function SectionCard({ section }: { section: SettingsPageSection }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <div>
          <CardTitle className="font-heading text-lg font-semibold">{section.title}</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-2">
        <div className="divide-y divide-border">
          {section.fields.map((field) => (
            <SectionFieldRow key={field.id} field={field} />
          ))}
        </div>

        {section.footerActions?.length ? (
          <>
            <Separator className="mt-2" />
            <div className="flex flex-wrap items-center justify-end gap-2.5 py-4">
              {section.footerActions.map((action) => (
                <Button
                  key={action.id}
                  variant={getSettingsActionVariant(action.intent)}
                  size="sm"
                  className={cn(action.intent === 'secondary' && 'border-transparent shadow-none')}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { SectionCard }
