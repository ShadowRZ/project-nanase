import type { Meta, StoryObj } from 'storybook-solidjs';
import CInput from './Input';

const meta: Meta<typeof CInput> = {
  component: CInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['text', 'email', 'tel', 'password', 'url', 'date', 'default'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CInput>;

export const Input: Story = {
  args: {
    label: 'Your name',
    error: '',
    placeholder: 'Enter your name',
  },
};

export const Password: Story = {
  args: {
    label: 'Your password',
    error: '',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Email: Story = {
  args: {
    label: 'Your email',
    error: '',
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Disabled: Story = {
  args: {
    label: '?',
    error: '',
    placeholder: '...',
    disabled: true,
  },
};
