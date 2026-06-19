import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import SettingsPage from './SettingsPage'
import { settingsPageFixture } from './SettingsPage.fixtures'

describe('SettingsPage', () => {
  it('preserves static exports', () => {
    expect(SettingsPage.SectionCard).toBeTypeOf('function')
    expect(SettingsPage.SectionNav).toBeTypeOf('function')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(<SettingsPage loading />)

    expect(markup).toContain('h-28')
    expect(markup).toContain('min-h-96')
  })

  it('renders a retry action only when a retry route is provided', () => {
    const withoutRetry = renderToStaticMarkup(<SettingsPage error="Network issue" />)
    const withRetry = renderToStaticMarkup(
      <SettingsPage error="Network issue" retryHref="/settings" />,
    )

    expect(withoutRetry).not.toContain('Retry')
    expect(withoutRetry).not.toContain('href="/settings"')
    expect(withRetry).toContain('Retry')
    expect(withRetry).toContain('href="/settings"')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(<SettingsPage data={settingsPageFixture} />)

    expect(markup).toContain('Workspace areas')
    expect(markup).toContain('Active section')
    expect(markup).toContain(settingsPageFixture.sections[0].title)
  })
})
