import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CProgressButton from './ProgressButton';

const meta: Meta<typeof CProgressButton> = {
  component: CProgressButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['button', 'submit', 'reset'],
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgressButton: Story = {
  args: {
    text: 'Next',
    busy: false,
  },
};
