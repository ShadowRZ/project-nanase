import type { Meta, StoryObj } from 'storybook-solidjs';
import CTime from './Time';

const meta: Meta<typeof CTime> = {
  component: CTime,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CTime>;

export const Time: Story = {
  args: {
    timestamp: 1_700_000_000_000,
  },
};
