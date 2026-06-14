import { Button } from '../../../components/ui/button'
import type { AuthPageProps } from './AuthPage.types'

export const authPageFixture: AuthPageProps = {
  eyebrow: 'Welcome back',
  title: 'Keep your interview prep moving.',
  description:
    'Sign in to reopen your notebooks, review queue, and the interview sessions that still need follow-through.',
  reassurance: 'Private by default. Your activity stays tied to your account only.',
  children: (
    <div className="space-y-3">
      <div className="h-10 rounded-lg border border-border/70 bg-muted/40" />
      <div className="h-10 rounded-lg border border-border/70 bg-muted/40" />
      <Button className="w-full">Continue</Button>
    </div>
  ),
  footer: <p className="text-sm text-muted-foreground">Need help? Contact support.</p>,
}
