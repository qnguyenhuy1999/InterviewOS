import type { CodeEditorProps } from '../../organisms/CodeEditor'

export interface CodingChallengePageProps {
  problem: CodeEditorProps['problem']
  language: CodeEditorProps['language']
  value: string
  onChange: (value: string) => void
  testResults?: CodeEditorProps['testResults']
  onRunTests?: () => void
  onReset?: () => void
}
