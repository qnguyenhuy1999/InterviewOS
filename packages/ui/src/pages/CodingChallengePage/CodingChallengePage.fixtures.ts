import type { CodingChallengePageProps } from './CodingChallengePage.types'

export const codingChallengePageFixture: Omit<CodingChallengePageProps, 'onChange'> & {
  value: string
} = {
  problem: {
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints:
      '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nExactly one valid answer exists.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
  },
  language: 'JavaScript',
  value: 'function twoSum(nums, target) {\n  // your solution here\n}',
  testResults: undefined,
}
