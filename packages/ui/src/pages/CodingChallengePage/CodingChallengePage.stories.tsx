import type { Meta, StoryObj } from '@storybook/react-vite'

import { CodingChallengePage } from './CodingChallengePage'
import { codingChallengePageFixture } from './CodingChallengePage.fixtures'

const meta = {
  title: 'Pages/CodingChallengePage',
  component: CodingChallengePage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    ...codingChallengePageFixture,
    onChange: () => {},
  },
} satisfies Meta<typeof CodingChallengePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithTestResults: Story = {
  args: {
    testResults: [
      {
        name: 'Example 1',
        status: 'pass',
        input: 'nums=[2,7,11,15], target=9',
        expected: '[0,1]',
        got: '[0,1]',
      },
      {
        name: 'Example 2',
        status: 'fail',
        input: 'nums=[3,2,4], target=6',
        expected: '[1,2]',
        got: '[0,2]',
      },
    ],
  },
}
