import {
  ExperienceLevel,
  InterviewType,
  NoteStatus,
  NoteType,
  QuestionDifficulty,
} from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'

const meta = {
  title: 'Atoms/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select option..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const InterviewTypeSelect: Story = {
  render: () => (
    <div className="grid gap-1.5 w-64">
      <Label htmlFor="interview-type">Interview Type</Label>
      <Select>
        <SelectTrigger id="interview-type" className="w-full">
          <SelectValue placeholder="Select type..." />
        </SelectTrigger>
        <SelectContent>
          {Object.values(InterviewType).map((type) => (
            <SelectItem key={type} value={type}>
              {type.replace('_', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

export const ExperienceLevelSelect: Story = {
  render: () => (
    <div className="grid gap-1.5 w-64">
      <Label htmlFor="experience-level">Current Level</Label>
      <Select>
        <SelectTrigger id="experience-level" className="w-full">
          <SelectValue placeholder="Select level..." />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ExperienceLevel).map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

export const NoteTypeSelect: Story = {
  render: () => (
    <div className="grid gap-1.5 w-64">
      <Label htmlFor="note-type">Note Type</Label>
      <Select>
        <SelectTrigger id="note-type" className="w-full">
          <SelectValue placeholder="Select note type..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {Object.values(NoteStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Type</SelectLabel>
            {Object.values(NoteType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const DifficultySelect: Story = {
  render: () => (
    <div className="grid gap-1.5 w-64">
      <Label>Question Difficulty</Label>
      <Select defaultValue={QuestionDifficulty.MEDIUM}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(QuestionDifficulty).map((diff) => (
            <SelectItem key={diff} value={diff}>
              {diff}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option">Option</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-40" size="sm">
        <SelectValue placeholder="Small..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="technical">Technical</SelectItem>
        <SelectItem value="behavioral">Behavioral</SelectItem>
      </SelectContent>
    </Select>
  ),
}
