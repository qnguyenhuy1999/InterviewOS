import { ExperienceLevel } from '@interviewos/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

import UserProfileCard from './UserProfileCard'
import { learningProfileFixture, userFixtures } from './UserProfileCard.fixtures'

const meta = {
  title: 'Molecules/UserProfileCard',
  component: UserProfileCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof UserProfileCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithProfile: Story = {
  args: {
    user: userFixtures.jane,
    profile: learningProfileFixture,
    onEdit: () => {},
  },
}

export const NoProfile: Story = {
  args: {
    user: userFixtures.jane,
  },
}

export const AnonymousUser: Story = {
  args: {
    user: userFixtures.anonymous,
    profile: {
      ...learningProfileFixture,
      userId: userFixtures.anonymous.id,
    },
  },
}

export const Loading: Story = {
  args: {
    user: userFixtures.jane,
    loading: true,
  },
}

export const AllExperienceLevels: Story = {
  args: { user: userFixtures.jane },
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.values(ExperienceLevel).map((level) => (
        <UserProfileCard
          key={level}
          user={userFixtures.jane}
          profile={{
            ...learningProfileFixture,
            currentLevel: level,
            targetLevel: ExperienceLevel.PRINCIPAL,
          }}
        />
      ))}
    </div>
  ),
}
