import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { CodeEditor } from './CodeEditor'

const meta = {
  title: 'Organisms/CodeEditor',
  component: CodeEditor,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', padding: 24, background: 'var(--color-surface-base)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeEditor>

export default meta
type Story = StoryObj<typeof meta>

const PROBLEM = {
  title: 'Two Sum',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  constraints: '2 ≤ nums.length ≤ 10⁴  |  -10⁹ ≤ nums[i] ≤ 10⁹',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
  ],
}

const STARTER = `function twoSum(nums, target) {\n  // Your solution here\n}`

export const Default: Story = {
  render: () => {
    const [code, setCode] = React.useState(STARTER)
    return (
      <CodeEditor
        problem={PROBLEM}
        language="JavaScript"
        value={code}
        onChange={setCode}
        onRunTests={() => alert('Running tests…')}
        onReset={() => setCode(STARTER)}
      />
    )
  },
}

export const WithPassingTests: Story = {
  render: () => {
    const [code, setCode] = React.useState(STARTER)
    return (
      <CodeEditor
        problem={PROBLEM}
        language="TypeScript"
        value={code}
        onChange={setCode}
        testResults={[
          { name: 'Example 1', status: 'pass' },
          { name: 'Example 2', status: 'pass' },
          { name: 'Edge case: duplicate', status: 'pass' },
        ]}
      />
    )
  },
}

export const WithFailingTests: Story = {
  render: () => {
    const [code, setCode] = React.useState(STARTER)
    return (
      <CodeEditor
        problem={PROBLEM}
        language="Python"
        value={code}
        onChange={setCode}
        testResults={[
          { name: 'Example 1', status: 'pass' },
          { name: 'Example 2', status: 'fail', expected: '[1,2]', got: '[0,1]' },
          { name: 'Edge case: duplicate', status: 'fail', expected: '[1,3]', got: 'undefined' },
        ]}
      />
    )
  },
}
