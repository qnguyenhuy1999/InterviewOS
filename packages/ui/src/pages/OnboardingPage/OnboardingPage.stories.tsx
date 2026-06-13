import type { Meta, StoryObj } from '@storybook/react-vite'

import OnboardingPage from './OnboardingPage'

const meta = {
  title: 'Pages/OnboardingPage',
  component: OnboardingPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof OnboardingPage>

export default meta
type Story = StoryObj<typeof meta>

function MockForm() {
  return (
    <div className="space-y-4">
      {['Full name', 'Target role', 'Years of experience', 'Tech stack'].map((label) => (
        <div key={label} className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{label}</label>
          <div className="h-10 w-full rounded-lg border border-input bg-background px-3" />
        </div>
      ))}
      <button
        type="button"
        className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
      >
        Continue
      </button>
    </div>
  )
}

export const Default: Story = {
  args: {
    children: <MockForm />,
  },
}

export const WithReason: Story = {
  args: {
    reason: 'Complete your profile to unlock AI-powered interview preparation.',
    children: <MockForm />,
  },
}

export const Empty: Story = {
  args: {},
}
