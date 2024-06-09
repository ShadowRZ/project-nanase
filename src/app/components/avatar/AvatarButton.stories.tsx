import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar.Button> = {
  component: Avatar.Button,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'large'] },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Large: Story = {
  args: {
    size: 'large',
    src: '',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    src: '',
  },
};

export const LargeChecked: Story = {
  args: {
    size: 'large',
    src: '',
    checked: true,
  },
};

export const SmallChecked: Story = {
  args: {
    size: 'small',
    src: '',
    checked: true,
  },
};
