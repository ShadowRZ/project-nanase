import type { Meta, StoryObj } from 'storybook-solidjs';
import NotificationCount from './NotificationCount';

const meta: Meta<typeof NotificationCount> = {
  component: NotificationCount,
  tags: ['autodocs'],
  args: {
    count: 1,
  },
};

export default meta;
type Story = StoryObj<typeof NotificationCount>;

export const Normal: Story = {};

export const Highlight: Story = {
  args: {
    highlight: true,
  },
};
