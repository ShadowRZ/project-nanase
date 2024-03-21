import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium'] },
    color: { control: 'radio', options: ['primary', 'secondary', 'danger'] },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: 'small',
    color: 'primary',
    children: 'Button',
  },
};

export const MediumPrimary: Story = {
  args: {
    size: 'medium',
    color: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    size: 'small',
    color: 'secondary',
    children: 'Button',
  },
};

export const MediumSecondary: Story = {
  args: {
    size: 'medium',
    color: 'secondary',
    children: 'Button',
  },
};

export const Danger: Story = {
  args: {
    size: 'small',
    color: 'danger',
    children: 'Button',
  },
};

export const MediumDanger: Story = {
  args: {
    size: 'medium',
    color: 'danger',
    children: 'Button',
  },
};
