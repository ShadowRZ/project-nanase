// @unocss-ignore
import type { Meta, StoryObj } from 'storybook-solidjs';
import CProfileContent from './ProfileContent';

const meta: Meta<typeof CProfileContent> = {
  component: CProfileContent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CProfileContent>;

export const ProfileContent: Story = {
  args: {
    avatar: '',
    name: 'Alice',
    userId: '@alice:example.org',
  },
};
