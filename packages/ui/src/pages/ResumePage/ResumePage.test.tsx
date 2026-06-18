import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ResumePage from './ResumePage'
import { resumePageFixture } from './ResumePage.fixtures'

describe('ResumePage', () => {
  it('preserves static exports', () => {
    expect(ResumePage.AnalysisRow).toBeTypeOf('function')
    expect(ResumePage.CurrentResumeRow).toBeTypeOf('function')
    expect(ResumePage.TopicRow).toBeTypeOf('function')
    expect(ResumePage.UploadPanel).toBeTypeOf('function')
  })

  it('renders the loading branch', () => {
    const markup = renderToStaticMarkup(<ResumePage loading />)

    expect(markup).toContain('h-40')
    expect(markup).toContain('min-h-48')
  })

  it('renders the ready branch', () => {
    const markup = renderToStaticMarkup(<ResumePage data={resumePageFixture} />)

    expect(markup).toContain(resumePageFixture.currentResume.title)
    expect(markup).toContain(resumePageFixture.analysis.title)
    expect(markup).toContain(resumePageFixture.suggestedTopics.title)
  })
})
