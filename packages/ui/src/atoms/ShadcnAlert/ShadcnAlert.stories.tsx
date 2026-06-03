import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, TriangleAlertIcon } from 'lucide-react'
import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'

const meta = {
  title: 'Shadcn/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <InfoIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your interview session is scheduled to start in 30 minutes.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertCircleIcon />
      <AlertTitle>Session failed</AlertTitle>
      <AlertDescription>
        Failed to save your interview answers. Please check your connection.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert className="w-96 border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
      <CheckCircle2Icon />
      <AlertTitle>Session complete</AlertTitle>
      <AlertDescription>Your interview session has been saved. Score: 82/100.</AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert className="w-96 border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
      <TriangleAlertIcon />
      <AlertTitle>Low score detected</AlertTitle>
      <AlertDescription>
        Your recent scores suggest reviewing React hooks fundamentals.
      </AlertDescription>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Alert className="w-96">
      <InfoIcon />
      <AlertTitle>New recommendation</AlertTitle>
      <AlertDescription>
        Based on your recent sessions, we recommend reviewing system design patterns.
      </AlertDescription>
      <div className="mt-3">
        <Button size="xs">View Recommendation</Button>
      </div>
    </Alert>
  ),
}
