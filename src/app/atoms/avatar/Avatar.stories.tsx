import type { Meta, StoryObj } from 'storybook-solidjs';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'large'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Large: Story = {
  args: {
    size: 'large',
    src: '',
    outlined: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    src: '',
    outlined: true,
  },
};
