import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdminDashboardPage } from './AdminDashboardPage'
import { adminDashboardPageFixture } from './AdminDashboardPage.fixtures'

const meta = {
  title: 'Pages/AdminDashboardPage',
  component: AdminDashboardPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: adminDashboardPageFixture,
} satisfies Meta<typeof AdminDashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
