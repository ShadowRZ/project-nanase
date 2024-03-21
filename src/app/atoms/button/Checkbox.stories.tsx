import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CCheckbox from './Checkbox';

const meta: Meta<typeof CCheckbox> = {
  component: CCheckbox,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
  args: {
    name: 'checkbox',
    value: '',
    label: 'Receive Notifications',
    description: 'Receive notifications when new message arrives.',
    checked: false,
    error: 'What?!',
  },
};
