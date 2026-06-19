import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ProfilePage from './ProfilePage'

describe('ProfilePage', () => {
  it('preserves static exports', () => {
    expect(ProfilePage.Field).toBeTypeOf('function')
    expect(ProfilePage.InsightList).toBeTypeOf('function')
    expect(ProfilePage.ResumeInsightCard).toBeTypeOf('function')
    expect(ProfilePage.ResumeUploadCard).toBeTypeOf('function')
    expect(ProfilePage.SelectField).toBeTypeOf('function')
    expect(ProfilePage.TagField).toBeTypeOf('function')
  })

  it('renders loading body when loading is true', () => {
    const markup = renderToStaticMarkup(<ProfilePage loading />)

    expect(markup).toContain('Profile')
    expect(markup).toContain('h-72')
  })

  it('renders error body when error is present', () => {
    const markup = renderToStaticMarkup(<ProfilePage error="Network issue" />)

    expect(markup).toContain('Failed to load profile')
    expect(markup).toContain('Network issue')
    expect(markup).not.toContain('Retry')
  })

  it('renders state actions only when routes are provided', () => {
    const emptyMarkup = renderToStaticMarkup(<ProfilePage empty />)
    const emptyWithAction = renderToStaticMarkup(<ProfilePage empty setupProfileHref="/settings" />)
    const errorWithAction = renderToStaticMarkup(
      <ProfilePage error="Network issue" retryHref="/profile" />,
    )

    expect(emptyMarkup).not.toContain('Set up profile')
    expect(emptyMarkup).not.toContain('href="/settings"')
    expect(emptyWithAction).toContain('Set up profile')
    expect(emptyWithAction).toContain('href="/settings"')
    expect(errorWithAction).toContain('Retry')
    expect(errorWithAction).toContain('href="/profile"')
  })
})
