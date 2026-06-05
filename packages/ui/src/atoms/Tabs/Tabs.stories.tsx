import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon, BrainCircuitIcon, SettingsIcon } from 'lucide-react'
import React from 'react'

import { Badge } from '../../../components/ui/badge'
import { Card, CardContent } from '../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

const meta = {
  title: 'Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="notes" className="w-80">
      <TabsList>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Your study notes will appear here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sessions">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Interview sessions will appear here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Settings panel.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="notes" className="w-80">
      <TabsList>
        <TabsTrigger value="notes">
          <BookOpenIcon /> Notes
        </TabsTrigger>
        <TabsTrigger value="sessions">
          <BrainCircuitIcon /> Sessions
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon /> Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <p className="text-sm text-muted-foreground pt-2">Notes content.</p>
      </TabsContent>
      <TabsContent value="sessions">
        <p className="text-sm text-muted-foreground pt-2">Sessions content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground pt-2">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <Tabs defaultValue="notes" className="w-80">
      <TabsList>
        <TabsTrigger value="notes">
          Notes{' '}
          <Badge variant="secondary" className="ml-1">
            47
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="sessions">
          Sessions{' '}
          <Badge variant="secondary" className="ml-1">
            24
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <p className="text-sm text-muted-foreground pt-2">Notes content.</p>
      </TabsContent>
      <TabsContent value="sessions">
        <p className="text-sm text-muted-foreground pt-2">Sessions content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="notes" className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <p className="text-sm text-muted-foreground pt-2">Notes content.</p>
      </TabsContent>
      <TabsContent value="sessions">
        <p className="text-sm text-muted-foreground pt-2">Sessions content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground pt-2">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="notes" orientation="vertical" className="w-80">
      <TabsList>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <p className="text-sm text-muted-foreground">Notes content.</p>
      </TabsContent>
      <TabsContent value="sessions">
        <p className="text-sm text-muted-foreground">Sessions content.</p>
      </TabsContent>
    </Tabs>
  ),
}
