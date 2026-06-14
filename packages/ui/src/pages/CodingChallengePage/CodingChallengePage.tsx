import { useState } from 'react'

import { CodeEditor } from '../../organisms/CodeEditor'
import type { CodingChallengePageProps } from './CodingChallengePage.types'

export function CodingChallengePage({
  problem,
  language,
  value: initialValue,
  testResults,
  onRunTests,
  onReset,
}: CodingChallengePageProps) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="h-screen w-screen overflow-hidden">
      <CodeEditor
        problem={problem}
        language={language}
        value={value}
        onChange={setValue}
        testResults={testResults}
        onRunTests={onRunTests}
        onReset={onReset}
      />
    </div>
  )
}

export default CodingChallengePage
