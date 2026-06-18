import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Separator } from '../../../../components/ui/separator'
import { SESSION_PAGE_SECURITY_TIPS } from '../SessionPage.constants'

function SecurityTipsCard() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b py-4">
        <CardTitle className="font-heading text-lg font-semibold">Security tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {SESSION_PAGE_SECURITY_TIPS.map((tip, i) => (
          <div key={tip.title}>
            <div className="space-y-1 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{tip.body}</p>
            </div>
            {i < SESSION_PAGE_SECURITY_TIPS.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { SecurityTipsCard }
